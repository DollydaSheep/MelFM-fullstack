require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require("mysql2");
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const SpotifyWebAPI = require('spotify-web-api-node');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dkyexuxocwhcxzpjannt.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const userRoutes = require('./routes/userRoutes')

const port = 3020;

const spotifyAPI = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
})

let user;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = user;
    const uploadDir = './uploads'
    const baseName = "profile-" + file.fieldname + "-" + uniqueSuffix;
    const ext = path.extname(file.originalname);

    fs.readdir(uploadDir, (err, files) => {
      if (err) return cb(err);

      files.forEach(existingFile => {
        if (path.parse(existingFile).name === baseName) {
          fs.unlinkSync(path.join(uploadDir, existingFile)); // delete file
          console.log("deleted")
        }
      });
    });

    cb(null, "profile-" + file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
})

const upload = multer({ storage: storage })

const app = express();

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'hahax2x4',
//     database: 'melfm-fs'
// })

app.use(express.json());
app.use(cors());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/login',async (req,res) => {
    
    // var query = `select * from Users where username = '${req.body.user}'`;
    // db.query(query,async (error,results)=>{
    //     if(error) throw error;
    //     if(results.length == 0){
    //         return res.status(404).json({message:"invalid"});
    //     }
    //     else{
    //         user = req.body.user;
    //         let refresh = results[0].refreshToken;
    //         return res.status(200).json({user: req.body.user, refresh: refresh, id:results[0].id, listens: results[0].listens});
    //     }
    // })
    const {data,error} = await supabase
        .from('users')
        .select('*')
        .eq('username',req.body.user)
    
    if(error) throw error
    else{
        user = data[0].username;
        console.log(data[0].username);
        let refresh = data[0].refreshToken;
        return res.status(200).json({user: req.body.user, refresh: refresh, id:data[0].id, listens: data[0].listens});
    }
})

app.post('/signup', async (req,res)=>{
    user = req.body.user;
    // var query = `insert into users (username,pass) values ("${req.body.user}","${req.body.pass}")`;
    // db.query(query, function(error,results){
    //     if(error) throw error
    //     else{
    //         const scopes = ['user-read-currently-playing'];
    //         let authorizeURL = spotifyAPI.createAuthorizeURL(scopes);
    //         authorizeURL += '&showdialog=true';
    //         console.log(authorizeURL);
    //         return res.status(200).json({url:authorizeURL});
    //     }
    // })
    try{
        const {data,error} = await supabase
        .from('users')
        .insert([
            {username: req.body.user, pass: req.body.pass},
        ])
        .select()
        if(error) throw error
        else{
            const scopes = ['user-read-currently-playing','user-read-playback-state'];
            let authorizeURL = spotifyAPI.createAuthorizeURL(scopes);
            authorizeURL += '&showdialog=true';
            console.log(authorizeURL);
            return res.status(200).json({url:authorizeURL});
        }
    } catch (err){
        console.error(err);
    }
    
    
})

app.post('/settings',upload.single('image'),async (req,res) => {
    console.log(user);
    const {data,error} = await supabase
        .from('users')
        .update({profile_img : `/uploads/profile-image-${user}`})
        .eq('username',`${user}`)
        .select()
    if(error) throw error
    else{
        res.redirect('http://localhost:5173/settings')
    }
})

app.get('/callback', async (req,res) =>{
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if(error) throw error
    const data = await spotifyAPI.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];

        // var query = `update Users set refreshToken = "${refreshToken}" where username = "${user}"`;
        // db.query(query,(error,result)=>{
        //     if(error) throw error
        //     else{
        //         return res.redirect('http://localhost:5173/login');
        //     }
        // })
    const {data:updatedUser,error:supabaseError} = await supabase
        .from('users')
        .update({refreshToken: refreshToken})
        .eq('username', user)
        .select()

    if(supabaseError) throw error
    else return res.redirect('http://localhost:5173/login');
})

app.use(userRoutes);

const server = app.listen(port, ()=>{
    console.log("server is running on localhost 3020");
})

const io = require('socket.io')(server, {
    cors: {origin: ['http://localhost:5173']}
})

const userSockets = {};
const userSpotifyAPI = {};

io.use((socket,next)=>{
    if (socket.handshake.auth.token){
        console.log(socket.handshake.auth.token);
        socket.username = socket.handshake.auth.user;
        next();
    }else{
        console.log("no token");
    }
})

io.on("connection", async (socket)=>{
    console.log("connected " + socket.username);

    const user = socket.handshake.auth.user;

    if(!userSpotifyAPI[user]){
        userSpotifyAPI[user] = new SpotifyWebAPI({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URL
        });
    }
    const uSpotifyAPI = userSpotifyAPI[user];
    uSpotifyAPI.setRefreshToken(socket.handshake.auth.refresh);
    try {
        const data = await uSpotifyAPI.refreshAccessToken();
        const accessTokenRefreshed = data.body['access_token'];
        uSpotifyAPI.setAccessToken(accessTokenRefreshed);

        // Optionally, update the session with the new access token if you're storing tokens there
        console.log('The access token has been refreshed:', accessTokenRefreshed);
    } catch (err) {
        console.error('Could not refresh access token:', err);
    }

    if(user){
        userSockets[user] = socket.id;
        let currentTrack;
        let lis_num;
        const {data: lisnumData, error: lisnumError} = await supabase
            .from('users')
            .select('listens')
            .eq('username',user)
            .single()
        if(lisnumError) throw lisnumError
        
        else lis_num = lisnumData.listens;
        // let lis_num = socket.handshake.auth.listens;

        const pollInterval = setInterval(async ()=>{
            try{
                const data = await uSpotifyAPI.getMyCurrentPlayingTrack();
                const isPlaying = await uSpotifyAPI.getMyCurrentPlaybackState();
                let isPlayingData = {track_name: data.body.item.name, is_playing: isPlaying};

                console.log((Object.keys(data.body).length != 0 ? data.body.item.name : "no song"));
                let track_Info = {};
                if(Object.keys(data.body).length != 0){
                    let date = new Date();
                    track_Info = {track_name:data.body.item.name,artist_name:data.body.item.artists[0].name,album_cover:data.body.item.album.images[1].url,created_at:date.toJSON()}
                    if(currentTrack != data.body.item.name){
                        lis_num++;
                        // var query = `insert into listen (track_name,album_cover,artist_name,listen_num,owner_id,date_time) values (?,?,?,?,?,?)`;
                        // db.query(query,[data.body.item.name,data.body.item.album.images[1].url,data.body.item.artists[0].name,lis_num,socket.handshake.auth.id,date.toJSON()],(error,results)=>{
                        //     if(error) throw error
                        //     else{
                        //         currentTrack = data.body.item.name;
                        //         console.log(data.body.item.name + " logged");
                        //         var query = `update users set listens = ? where username = ?`;
                        //         db.query(query,[lis_num,user],(error,results)=>{
                        //             if (error) throw error
                        //             else{
                        //                 socket.emit("current-track",(Object.keys(track_Info).length != 0 ? track_Info : ""));
                        //                 console.log(lis_num);
                        //             }
                        //         })
                        //     }
                        // })
                        const artistData = await uSpotifyAPI.getArtist(data.body.item.artists[0].id);
                        const artistImg = artistData.body.images[1].url;
                        const {data: trackData,error: trackError} = await supabase
                            .from('listen')
                            .insert([
                                {
                                    track_name: data.body.item.name,
                                    album_cover: data.body.item.album.images[1].url,
                                    artist_name: data.body.item.artists[0].name,
                                    listen_num: lis_num,
                                    artist_img: artistImg,
                                    owner_id: socket.handshake.auth.id
                                }
                            ])
                            .select()
                        if(trackError) throw trackError
                        else{
                            currentTrack = data.body.item.name;
                            console.log(data.body.item.name + " logged");
                            const {data: updateUser, error: updateError} = await supabase
                                .from('users')
                                .update({listens: lis_num})
                                .eq('username', user)
                            if(updateError) throw updateError
                            else{
                                socket.emit("current-track",(Object.keys(track_Info).length != 0 ? track_Info : ""));
                                console.log(lis_num);
                            }
                        }
                    }
                }
                
                
                socket.emit('is_playing',(Object.keys(data).length != 0 ? isPlayingData : ""));

                console.log(userSockets[user] + " " + socket.username);
                console.log("");
            }catch(err){
                console.error(err);
            }
        },5000)
    
        socket.on('disconnect', ()=>{
            console.log("disconnected");
            clearInterval(pollInterval);
            delete userSockets[user];
        })
    }else{
        console.log("no username provided");
    }
    
})
