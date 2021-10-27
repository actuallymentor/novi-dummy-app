import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const { REACT_APP_apiKey, REACT_APP_authDomain, REACT_APP_projectId, REACT_APP_storageBucket, REACT_APP_messagingSenderId, REACT_APP_appId } = process.env

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_apiKey,
  authDomain: REACT_APP_authDomain,
  projectId: REACT_APP_projectId,
  storageBucket: REACT_APP_storageBucket,
  messagingSenderId: REACT_APP_messagingSenderId,
  appId: REACT_APP_appId
}

// Initialize Firebase
export const app = initializeApp( firebaseConfig )
const auth = getAuth()
export const db = getFirestore()

// ///////////////////////////////
// User functions
// ///////////////////////////////
// const registerUser = ( email, password ) => createUserWithEmailAndPassword( auth, email, password ).then( ( { user } ) => user )

export async function registerUser( email, password, age ) {

  // Create new user
  const userCredential = await createUserWithEmailAndPassword( auth, email, password )
  const { user } = userCredential

  // Save user age to firestore
  const documentReference = doc( db, 'userMetadata', user.uid )
  await setDoc( documentReference, {
    age: age
  }, { merge: true } )

  // Return the newly created user
  return user

}

export async function loginUser( email, password ) {

  // Log user in
  const userCredential = await signInWithEmailAndPassword( auth, email, password )
  const { user } = userCredential

  // Return the user
  return user

}

export function logout(  ) {
  signOut( auth )
}