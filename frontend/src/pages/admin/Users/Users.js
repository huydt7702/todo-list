import React, { useState } from 'react';
import "./user.css";
function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'HungDev 1', email: 'voviethungdev@gmail.com'},
    { id: 2, name: 'HungDev 2', email: 'voviethungdev@gmail.com'},
    { id: 3, name: 'HungDev 3', email: 'voviethungdev@gmail.com'},
  ]);

  const handleEdit = (userId) => {
    //edituser
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    // xóa user
    const shouldDelete = window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${userId} này không?`);
    if (shouldDelete) {
        
        console.log(`Delete user with ID: ${userId}`);
      }
  };

  return (
    <div className="wrapper">
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
