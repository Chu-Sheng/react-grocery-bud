import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
const getLocalStorage = () => {
  return localStorage.getItem('list8') ?
    JSON.parse(localStorage.getItem('list8')) : []
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', msg: '' })
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('name: ', name);
    if (!name) {
      showAlert(true, 'danger', 'please enter value')
    } else if (name && isEditing) {
      // edit item
      // let specificItem = list.find((item) => item.id === editID);
      // specificItem.title = name;
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name }
          }
          return item;
        })
      )
      showAlert(true, 'danger', 'value changed');
      setEditID('');
      setIsEditing(false);
      setName('');
    } else if (name && !isEditing) {
      // add item;
      let id = new Date().getTime().toString();
      const newItem = { id: id, title: name };
      setList([...list, newItem]);
      setName('');
      showAlert(true, 'success', 'item added to the list');
    }
  }

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });

  }

  const removeItem = (id) => {
    console.log('removeItem id: ', id)
    const newItems = list.filter((item) =>
      item.id !== id
    );
    setList(newItems);
    showAlert(true, 'danger', 'item removed from list');
  }
  const editItem = (id) => {
    console.log('editItem id: ', id)
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }
  const clearList = () => {
    setList([]);
    showAlert(true, 'danger', 'all items removed!');
  }

  useEffect(() => {
    localStorage.setItem('list8', JSON.stringify(list))
  }, [list])
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>

        {alert.show && <Alert {...alert} showAlert={showAlert} list={list} />}

        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="e.g. egg"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">

          <List items={list} removeItem={removeItem} editItem={editItem} />

          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>

  )
}

export default App
