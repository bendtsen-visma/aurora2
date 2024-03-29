'use client'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from "../firebase";

function sortTimes(times: any[]): any[] {
  const definedTimes = times.filter(item => item.pickup !== undefined);
  const undefinedTimes = times.filter(item => item.pickup === undefined);

  definedTimes.sort((a, b) => {
      if (a.pickup && b.pickup) {
          const [aHour, aMinute] = a.pickup.split(':').map(Number);
          const [bHour, bMinute] = b.pickup.split(':').map(Number);

          if (aHour === bHour) {
              return aMinute - bMinute;
          }
          return aHour - bHour;
      }
      return 0;
  });

  return definedTimes.concat(undefinedTimes);
}

const AdminPage = () => {

    const [orders, setOrders] = useState<any[]>([])
    const [nextOpening, setNextOpening] = useState('')
    const [openingTime, setOpeningTime] = useState('')

    useEffect(() => {
        const q = query(collection(db, 'orders'))
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const itemArr: any = [];
  
          querySnapshot.forEach((doc) => {
            itemArr.push({...doc.data(), id: doc.id})
          });

          const res = sortTimes(itemArr);

          setOrders(res);
  
          return () => unsubscribe();
        });
  
    }, [])
  
    const deleteItem = async (id: any) => {
      await deleteDoc(doc(db, 'orders', id))
    }

    const sums = {
      plain: orders.reduce((total, item) => total + item.plain, 0),
      plainVHO: orders.reduce((total, item) => total + item.plainVHO, 0),
      plainGK: orders.reduce((total, item) => total + item.plainGK, 0),
      sesam: orders.reduce((total, item) => total + item.sesam, 0),
      sesamVHO: orders.reduce((total, item) => total + item.sesamVHO, 0),
      sesamGK: orders.reduce((total, item) => total + item.sesamGK, 0),
      mixed: orders.reduce((total, item) => total + item.mixed, 0),
      mixedVHO: orders.reduce((total, item) => total + item.mixedVHO, 0),
      mixedGK: orders.reduce((total, item) => total + item.mixedGK, 0),
      yoghurt: orders.reduce((total, item) => total + item.yoghurt, 0),
      soedt: orders.reduce((total, item) => total + item.soedt, 0),
    };

    const updateDate = async (e: any) => {
      
      e.preventDefault()

      const dato = doc(db, "open", "date");
      
      await updateDoc(dato, {
        next_date: nextOpening
      });

      setNextOpening('');
    }

    const updateTime = async (e: any) => {
      e.preventDefault()

      const time = doc(db, "open", "time");
      
      await updateDoc(time, {
        open_time: openingTime
      });

      setOpeningTime('');
    }

  return (
    <div>
        <h1 className='text-xl font-bold m-10'>Dashboard</h1>

        <div className='flex flex-col'>
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Næste åbningsdato</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={nextOpening} onChange={(e) => setNextOpening(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateDate}>Gem</button>
            </div>
          </label>
          
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Åbningstidspunkt</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateTime}>Gem</button>
            </div>
          </label>

        </div>

        <p>{nextOpening}</p>
        <p>{openingTime}</p>

        <div className="overflow-x-auto ml-10 mr-10">
          <table className='table'>
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Navn</th>
                <th>Telf</th>
                <th>Dato</th>
                <th>Pick-up</th>
                <th>Plain</th>
                <th>Plain m. VHO</th>
                <th>Plain m. GK</th>
                <th>Sesam</th>
                <th>Sesam m. VHO</th>
                <th>Sesam m. GK</th>
                <th>Mixed</th>
                <th>Mixed m. VHO</th>
                <th>Mixed m. GK</th>
                <th>Yoghurt</th>
                <th>Sødt</th>
                <th>Kommentar</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, id) => (
                <tr key={id}>
                  <td>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.time}</td>
                  <td>{item.pickup}</td>
                  <td>{item.plain}</td>
                  <td>{item.plainVHO}</td>
                  <td>{item.plainGK}</td>
                  <td>{item.sesam}</td>
                  <td>{item.sesamVHO}</td>
                  <td>{item.sesamGK}</td>
                  <td>{item.mixed}</td>
                  <td>{item.mixedVHO}</td>
                  <td>{item.mixedGK}</td>
                  <td>{item.yoghurt}</td>
                  <td>{item.soedt}</td>
                  <td>{item.comment}</td>
                  <td>
                    <button onClick={() => deleteItem(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="bg-base-200">
                <td colSpan={4}>Total</td>
                <td>{sums.plain}</td>
                <td>{sums.plainVHO}</td>
                <td>{sums.plainGK}</td>
                <td>{sums.sesam}</td>
                <td>{sums.sesamVHO}</td>
                <td>{sums.sesamGK}</td>
                <td>{sums.mixed}</td>
                <td>{sums.mixedVHO}</td>
                <td>{sums.mixedGK}</td>
                <td>{sums.yoghurt}</td>
                <td>{sums.soedt}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

    </div>
  )
}

export default AdminPage