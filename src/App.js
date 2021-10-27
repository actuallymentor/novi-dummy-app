import './App.css';

import React, { useState, useEffect } from 'react'
import { registerUser, loginUser, db, logout } from './modules/firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"

export default function App(  ){ 

  // ///////////////////////////////
  // State handling
  // ///////////////////////////////
  const [ email, setEmail ] = useState( '' )
  const [ password ,setPassword ] = useState( '' )
  const [ age, setAge ] = useState( '' )
  const [ user, setUser ] = useState( )
  const [ meta, setMeta ] = useState(  )
  const [ action, setAction ] = useState( 'login' )
  const [ loading, setLoading ] = useState( false )

  // ///////////////////////////////
  // Lifecycle handling
  // ///////////////////////////////

  // Listen to the user
  useEffect( f => {

    const auth = getAuth()
    return onAuthStateChanged( auth, user => setUser( user ) )

  }, [] )

  // Listen to user meta
  useEffect( f => {

    // If not user, exit
    if( !user ) return

    console.log( 'Current user ', user, meta )

    const userMeta = doc( db,  'userMetadata', user.uid )
    const stopListening = onSnapshot( userMeta, doc => {

      const data = doc.data()
      console.log( 'Metadata: ', data )
      setMeta( data )

    } )
    return stopListening

  }, [ user ] )

  // ///////////////////////////////
  // Component functions
  // ///////////////////////////////
  async function handleSubmit() {

    try {

      setLoading( `Doing ${ action }` )

      if( action === 'register' ) {
        const newUser = await registerUser( email, password, age )
        setUser( newUser )
      }

      if( action === 'login' ) {
        const oldUser = await loginUser( email, password )
        // setUser( oldUser )
      }

    } catch( e ) {

      setUser( null )
      console.log( e )
      alert( e.message )

    } finally {

      setLoading( false )

    }

  }

  // ///////////////////////////////
  // Render component
  // ///////////////////////////////

  if( loading ) return <main>
    <p>{ loading }</p>
  </main>

  if( user ) return <main>
    <p>Welcome { user.email }, you are { meta?.age } old</p>
    <button onClick={ logout }>Logout</button>
  </main>

  return <main>
    
      <div className="card">
    
        <input onChange={ ( { target } ) => setEmail( target.value ) } type='email' value={ email } placeholder='email' />
        <input onChange={ ( { target } ) => setPassword( target.value ) } type='password' value={ password } placeholder='password' />
        { action === 'register' && <input onChange={ ( { target } ) => setAge( target.value ) } type='number' value={ age } placeholder='age' /> }
        <button onClick={ handleSubmit }>{ action }</button>
        <p onClick={ f => setAction( action === 'login' ? 'register' : 'login' ) }>{ action === 'login' ? 'register' : 'login' } instead</p>

      </div>

  </main>

}