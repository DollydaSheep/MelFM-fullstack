const express = require('express')
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dkyexuxocwhcxzpjannt.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

router.get('/user/:username', async (req,res)=>{
    try{
        const user = req.params.username;
        const {data: userData,error: userError} = await supabase
            .from('users')
            .select('*')
            .eq('username',user)
        if(userError) throw userError
        else if(!userData) return res.sendStatus(404)
        else{
            const userId = userData[0].id;
            const {data: listenData,error: listenError} = await supabase
                .from('listen')
                .select('*,users(*)')
                .eq('owner_id',userId)
                .order('listen_num',{ascending: false})
                .limit(10);
            if(listenError) throw listenError

            const {data: topArtistData, error: topArtistError} = await supabase
                .rpc('top_artists_featured_by_user', {uid: userId});
            if(topArtistError) throw topArtistError

            const {data: topTracksData ,error: topTracksError} = await supabase
                .rpc('top_tracks_by_user', {uid: userId});
            if(topTracksError) throw topTracksError

            else return res.status(200).json({data: listenData, topArtist: topArtistData, topTracks: topTracksData ,listens:userData[0].listens})
        }

    } catch(error){
        console.error(error)
    }
    // try{
    //     const user = req.params.username;
    //     var query = `SELECT * from users where username = ?`;

    //     const [userResults] = await db.promise().query(query,[user]);
    //     if(userResults.length == 0){
    //         res.sendStatus(404);
    //     }

    //     const owner = userResults[0].id;
    //     var listenquery = `SELECT * FROM listen full join users on id = owner_id where owner_id = ? order by listen_num desc limit 10`;
    //     const [listenResult] = await db.promise().query(listenquery,[owner]);
        
    //     res.status(200).json(listenResult);

    // }catch(err){
    //     console.error(err);
    // }

    // db.query(query,[user],(error,results)=>{
    //     if(error) throw error
    //     if(results.length === 0){
    //         res.sendStatus(404);
    //     }
    //     else{
    //         var owner = results[0].id;
    //         var query = `SELECT * FROM listen full join users on id = owner_id where owner_id = ? order by listen_num desc limit 10`;
    //         db.query(query,[owner],(error,results)=>{
    //             if(error) throw error
    //             else{
    //                 res.status(200).json(results);
    //             }
    //         })
    //     }
    // })
    
})

router.get('/user/:username/library',async (req,res)=>{
    try{
        const user = req.params.username;
        const page = parseInt(req.query.page);
        const offset = (page - 1) * 20;
        var query = `SELECT * from users where username = ?`;

        const {data: userData, error: userError} = await supabase
            .from('users')
            .select('*')
            .eq('username',user)
        if(userError) throw userError
        
        const userResult = userData[0].id;

        const {data: listenData,error: listenError} = await supabase
            .from('listen')
            .select('*,users(*)')
            .eq('owner_id',userResult)
            .order('listen_num',{ascending: false})
            .range(offset, offset + 19);
        if(listenError) throw listenError
        else{
            return res.status(200).json({data:listenData,currentpage:page,totalpages:Math.ceil(userData[0].listens / 20),listens: userData[0].listens})
        }

        // const [userResults] = await db.promise().query(query,[user]);
        // if(userResults.length == 0){
        //     res.sendStatus(404);
        // }

        // const owner = userResults[0].id;
        // var listenquery = `SELECT * FROM listen full join users on id = owner_id where owner_id = ? order by listen_num desc limit 20 offset ${offset}`;
        // const [listenResult] = await db.promise().query(listenquery,[owner]);
        
        // res.status(200).json({data:listenResult,currentpage:page,totalpages:Math.ceil(userResults[0].listens / 20)});

    }catch(err){
        console.error(err);
    }
})

router.get('/user/:username/library/artist', async (req,res)=>{
    const user = req.params.username;
    const page = parseInt(req.query.page);
    const offset = (page - 1) * 20;

    try{
        const {data: userData,error: userError} = await supabase
            .from('users')
            .select('*')
            .eq('username',user)
        if(userError) throw userError

        const userId = userData[0].id;

        const {data,error} = await supabase
            .rpc('top_artists_by_user', {uid: userId});
        if(error) throw error
        else {
            console.log(data)
            return res.status(200).json({data:data,currentpage:page,totalpages:Math.ceil(data.length / 20),listens: userData[0].listens})
        }
    } catch(error){
        console.error(error)
    }
})

router.get('/user/:username/library/tracks', async (req,res)=>{
    const user = req.params.username;
    const page = parseInt(req.query.page);
    const offset = (page - 1) * 20;

    try{
        const {data: userData, error: userError} = await supabase
            .from('users')
            .select('*')
            .eq('username',user)
        if(userError) throw userError

        const userId = userData[0].id;

        const {data,error} = await supabase
            .rpc('top_tracks_by_user', {uid: userId});
        if(error) throw error
        else{
            return res.status(200).json({data:data,currentpage:page,totalpages:Math.ceil(data.length / 20),listens: userData[0].listens})
        }
    }catch(err){
        console.error(err)
    }
})

module.exports = router;