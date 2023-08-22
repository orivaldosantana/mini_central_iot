import React from 'react'
import '../App.css'

export default function Header(props) {
  return (
    <header>
      <h1> {props.title} </h1>
    </header>
  )
}
