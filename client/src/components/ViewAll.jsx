import React, { useEffect, useState} from 'react';
import './ViewAll.css'

const ViewAll = () => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        // const id = sessionStorage.getItem('id');
        // const userName = sessionStorage.getItem('userName');
        // const ou = sessionStorage.getItem('ou');
        // const division = sessionStorage.getItem('division');
        // const role = sessionStorage.getItem('role');
        const token = sessionStorage.getItem('token');


        // console.log(id);
        // console.log(userName);
        // console.log(ou);
        // console.log(division);
        // console.log(role);
        // console.log(token);

        //Authenticate user
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        //myHeaders.append("Content-Type", "text/plain");

        //var raw = "{\r\n    \"name\":\"\"\r\n}";

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        //body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:5000/api/users", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('result', result);
            setUsers(result);
            console.log('users', users);
        })
        .catch(error => console.log('error', error));

        //Get list of users -> put in state

        //Map users to html
    }, []);

    //Render a single user
    const renderUser = (user, idx) => {
        return (<tr key={idx}>
                <td>{user._id}</td>
                <td>{user.userName}</td>
                <td>{user.role}</td>
                <td>{user.ou}</td>
                <td>{user.division}</td>
                <td><a href={"/user/"+user._id}>Edit</a></td>
            </tr>)
    }

    //Render array of users
    const mapUsers = (users) => {
        const userMap = users.map((user, idx) => {
            return renderUser(user, idx);
        });
        return userMap;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>User name</th>
                        <th>Role</th>
                        <th>OU</th>
                        <th>Division</th>
                    </tr>
                </thead>
                <tbody>
                    {mapUsers(users)}
                </tbody>
            </table>
        </div>
    )
}

export default ViewAll;