import React from 'react';
export default function Menu() {
  return (
    <div>
      <h1 className='title'>Menu</h1>
      <div className='Button-row'>
        <h4>Set</h4>
        <h4>competition</h4>
      </div>
      <form action="http://localhost:5000/success" method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
      </form>
    </div>
  );
}