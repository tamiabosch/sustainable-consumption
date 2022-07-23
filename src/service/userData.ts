import { User } from '../models/User';
import { collection, query, where, orderBy } from "firebase/firestore";
import { ReviewType } from "../models/ReviewType";
import { db } from "./firebaseConfig";

export const getTaskOfTheWeekQuery = (userData: User) => {
    if (userData !== undefined) {
      var startDate = userData?.startDate.toDate()
      const manuell = new Date(2022, 6, 25); //month start with 0
      startDate = startDate ? startDate : manuell
  
      const currentDate = new Date();
      const secondWeek = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
      const thirdWeek = new Date(secondWeek.getFullYear(), secondWeek.getMonth(), secondWeek.getDate() + 7);
      const end = new Date(thirdWeek.getFullYear(), thirdWeek.getMonth(), thirdWeek.getDate() + 7);
      console.log('start: ' + startDate);
      //firestore collection reference
      const usersRef = collection(db, 'users')
      if (userData.task !== undefined) {
        if (startDate < currentDate && currentDate < secondWeek) {
          const q = query(usersRef, where('reviewType', '==', ReviewType.PeerReview), where('task.week1', '==', userData.task.week1), orderBy('peerReviewsWritten', 'asc'));
          console.log('user: ' + userData.email + ' is in week 1');
          return q;
        } else if (secondWeek < currentDate && currentDate < thirdWeek) {
          const q = query(usersRef, where('reviewType', '==', ReviewType.PeerReview), where('task.week2', '==', userData.task.week2), orderBy('peerReviewsWritten', 'asc'));
          console.log('user: ' + userData.email + ' is in week 2');
          return q;
        } else if (thirdWeek < currentDate && currentDate < end) {
          const q = query(usersRef, where('reviewType', '==', ReviewType.PeerReview), where('task.week3', '==', userData.task.week3), orderBy('peerReviewsWritten', 'asc'));
          console.log('user: ' + userData.email + ' is in week 3');
          return q;
        }
      } else {
        return false
      }
    } else {
      //console.log('getTaskOfTheWeekQuery(): userData is undefined');
      return false
  
    }
  }