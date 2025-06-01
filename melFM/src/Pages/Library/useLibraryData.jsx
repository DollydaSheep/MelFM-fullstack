import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'

const useLibraryData = (url) => {
    
        const location = useLocation();
        const [loading,setLoading] = useState(true);
        const [fdata,setFdata] = useState([]);
        const [page,setPage] = useState(1);
        const [listens,setListens] = useState(0);
        const [totalPages,setTotalPages] = useState(1)
        const [maxCount, setMaxCount] = useState(0);
    
        useEffect(()=>{
          const fetchData = async () => {
            try{
              const response = await fetch(`${url}?page=${page}`);
              if(response.ok){
                const data = await response.json();
                setFdata(data.data);
                setTotalPages(data.totalpages);
                setListens(data.listens);
                console.log("yeahman")
                setLoading(false)
                setMaxCount(data.data[0].listen_count)
              }
            }catch(error){
              console.error(error);
            }
          }
          fetchData();
        },[url,page])
  return (
    { loading, fdata, listens, page, totalPages, setPage, maxCount}
  );
}

export default useLibraryData
