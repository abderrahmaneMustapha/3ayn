import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import firebaseConfig from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getWatterPoints() {
  const pointsCol = collection(db, 'watterPoints');
  const pointSnapshot = await getDocs(pointsCol);
  const pointsList = pointSnapshot.docs.map(doc => doc.data());
  
  return pointsList;
}

export {getWatterPoints}