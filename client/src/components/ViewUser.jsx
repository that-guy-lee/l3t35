import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './ViewUser.css';


const ViewAll = () => {
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [mode, setMode] = useState("initial");
    const [success, setSuccess] = useState(false);
    const uri = "http://localhost:5000/api/users";
    
    useEffect(() => {
        const token = sessionStorage.getItem('token');

        //Authenticate user
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://localhost:5000/api/users/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            setUser(result);
        })
        .catch(error => console.log('error', error));
    }, []);

    // Handlers for change buttons
    const editName = (e) => {
        e.preventDefault();
        setSuccess(false);
        setMode("editName")
    }
    const editPassword = (e) => {
        e.preventDefault();
        setSuccess(false);
        setMode("editPassword")
    }

    const editOu = (e) => {
        e.preventDefault();
        setSuccess(false);
        setMode("editOu")
    }

    const editDivision = (e) => {
        e.preventDefault();
        setSuccess(false);
        setMode("editDivision")
    }

    const editRole = (e) => {
        e.preventDefault();
        setSuccess(false);
        setMode("editRole")
    }

    //Render methods for forms and their event handlers
    const showUserDetails = (user, mode) => {
        if (mode==="initial") {
            return (
                <ul className="user-list">
                    <li>Id: {user._id}</li>
                    <li>User name: {user.userName}</li>
                    <li>Role: {user.role}</li>
                    <li>OU: {user.ou}</li>
                    <li>Division: {user.division}</li>
                </ul>
            )
        }
    }

    const showChangeNameForm = (user, mode) => {
        if (mode==="editName") {
            return (
                <form onSubmit={onChangeName} className="form-layout">
                    <label htmlFor="oldName">Old user name</label>
                    <input type="text" name="oldName" value={user.userName} disabled={true}/>
                    
                    <label htmlFor="newName">New User Name</label>
                    <input type="text" name="newName" placeholder="Type new user name here"/>
                    
                    <label htmlFor="ou">OU</label>
                    <input type="text" name="ou" value={user.ou} disabled={true}/>
                    
                    <label htmlFor="division">Division</label>
                    <input type="text" name="division" value={user.division} disabled={true}/>

                    <button className="user-button" type="submit">Update</button>
                </form>
            )
        }
    }

    const onChangeName = (e) => {
        e.preventDefault();
        const fieldToBeUpdated = "userName";
        const oldName = e.target.elements.oldName.value
        const newName = e.target.elements.newName.value
        const ou = e.target.elements.ou.value
        const division = e.target.elements.division.value
        
        //Send request to API to change name
        const token = sessionStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        let raw = JSON.stringify({
            "fieldToBeUpdated": fieldToBeUpdated,
            "oldName": oldName,
            "newName": newName,
            "ou": ou,
            "division": division
        });

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:5000/api/users", requestOptions)
        .then(response => response.json())
        .then(result => {
            setSuccess(true);
        })
        .catch(error => console.log('error', error));
    }

    const showChangePasswordForm = (user, mode) => {
        if (mode==="editPassword") {
            return (
                <form onSubmit={onChangePassword} className="form-layout">
                    <label htmlFor="name">User name</label>
                    <input type="text" name="name" value={user.userName} disabled={true}/>
                    
                    <label htmlFor="newPassword">New Password</label>
                    <input type="text" name="newPassword" placeholder="Type new password here"/>
                    
                    <label htmlFor="ou">OU</label>
                    <input type="text" name="ou" value={user.ou} disabled={true}/>
                    
                    <label htmlFor="division">Division</label>
                    <input type="text" name="division" value={user.division} disabled={true}/>

                    <button className="user-button" type="submit">Update</button>
                </form>
            )
        }
    }

    const onChangePassword = (e) => {
        e.preventDefault();
        const fieldToBeUpdated = "password";
        const name = e.target.elements.name.value
        const newPassword = e.target.elements.newPassword.value
        const ou = e.target.elements.ou.value
        const division = e.target.elements.division.value
        
        let myBody = JSON.stringify({
            "fieldToBeUpdated": fieldToBeUpdated,
            "name": name,
            "newPassword": newPassword,
            "ou": ou,
            "division": division
        });
        
        //Send request to API
        update(uri, myBody);
    }

    const showChangeOuForm = (user, mode) => {
        if (mode==="editOu") {
            return (
                <form onSubmit={onChangeOu} className="form-layout">
                    <label htmlFor="name">User name</label>
                    <input type="text" name="name" value={user.userName} disabled={true}/>
                    
                    <label htmlFor="ou">OU</label>
                    <input type="text" name="ou" value={user.ou} disabled={true}/>
                    
                    <label htmlFor="newOu">New OU</label>
                    <input type="text" name="newOu" placeholder="Type new OU here"/>
                    
                    <label htmlFor="division">Division</label>
                    <input type="text" name="division" value={user.division} disabled={true}/>

                    <button className="user-button" type="submit">Update</button>
                </form>
            )
        }
    }

    const onChangeOu = (e) => {
        e.preventDefault();
        const fieldToBeUpdated = "ou";
        const name = e.target.elements.name.value
        const ou = e.target.elements.ou.value
        const newOu = e.target.elements.newOu.value
        const division = e.target.elements.division.value
        
        let myBody = JSON.stringify({
            "fieldToBeUpdated": fieldToBeUpdated,
            "name": name,
            "ou": ou,
            "newOu": newOu,
            "division": division
        });
        
        //Send request to API
        update(uri, myBody);
    }

    const showChangeDivisionForm = (user, mode) => {
        if (mode==="editDivision") {
            return (
                <form onSubmit={onChangeDivision} className="form-layout">
                    <label htmlFor="name">User name</label>
                    <input type="text" name="name" value={user.userName} disabled={true}/>
                    
                    <label htmlFor="ou">OU</label>
                    <input type="text" name="ou" value={user.ou} disabled={true}/>
                    
                    <label htmlFor="division">Division</label>
                    <input type="text" name="division" value={user.division} disabled={true}/>

                    <label htmlFor="newDivision">New Division</label>
                    <input type="text" name="newDivision" placeholder="Type new Division here"/>
                    
                    <button className="user-button" type="submit">Update</button>
                </form>
            )
        }
    }

    const onChangeDivision = (e) => {
        e.preventDefault();
        const fieldToBeUpdated = "division";
        const name = e.target.elements.name.value
        const ou = e.target.elements.ou.value
        const division = e.target.elements.division.value
        const newDivision = e.target.elements.newDivision.value
        
        let myBody = JSON.stringify({
            "fieldToBeUpdated": fieldToBeUpdated,
            "name": name,
            "ou": ou,
            "division": division,
            "newDivision": newDivision
        });
        
        //Send request to API
        update(uri, myBody);
    }

    const showChangeRoleForm = (user, mode) => {
        if (mode==="editRole") {
            return (
                <form onSubmit={onChangeRole} className="form-layout">
                    <label htmlFor="name">User name</label>
                    <input type="text" name="name" value={user.userName} disabled={true}/>
                    
                    <label htmlFor="ou">OU</label>
                    <input type="text" name="ou" value={user.ou} disabled={true}/>
                    
                    <label htmlFor="division">Division</label>
                    <input type="text" name="division" value={user.division} disabled={true}/>

                    <label htmlFor="newRole">New Role</label>
                    <input type="text" name="newRole" placeholder="Type new Role here"/>
                    
                    <button className="user-button" type="submit">Update</button>
                </form>
            )
        }
    }

    const onChangeRole = (e) => {
        e.preventDefault();
        const fieldToBeUpdated = "role";
        const name = e.target.elements.name.value
        const ou = e.target.elements.ou.value
        const division = e.target.elements.division.value
        const newRole = e.target.elements.newRole.value
        
        let myBody = JSON.stringify({
            "fieldToBeUpdated": fieldToBeUpdated,
            "name": name,
            "ou": ou,
            "division": division,
            "newRole": newRole
        });
        
        //Send request to API
        update(uri, myBody);
    }
    
    const update = async (uri, body) => {
        const token = sessionStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: body,
            redirect: 'follow'
        };

        await fetch(uri, requestOptions)
        .then(response => response.json())
        .then(result => {
            setSuccess(true);
        })
        .catch(error => console.log('error', error));
    }

    const goBack = () => {
        setMode("initial")
    }

    const showFeedbackMessage = (mode, success) => {
        let message;
        switch (mode) {
            case "editName":
                message = "User Name changed sucessfully";
                break;
            case "editPassword":
                message = "Password changed sucessfully";
                break;
            case "editOu":
                message = "OU changed sucessfully";
                break;
            case "editDivision":
                message = "Division changed sucessfully";
                break;
            case "editRole":
                message = "Role changed sucessfully";
                break;
            default:
                message = "Error: No update was made";
                break;
        }
        return (
            <p>{success && message}</p>
        );
    }

    return (
        <>
            {showUserDetails(user, mode)}
            {showChangeNameForm(user, mode)}
            {showChangePasswordForm(user, mode)}
            {showChangeOuForm(user, mode)}
            {showChangeDivisionForm(user, mode)}
            {showChangeRoleForm(user, mode)}
            {showFeedbackMessage(mode, success)}
            <div className="button-wrapper">
                <button className="user-button" onClick={editName}>Edit User Name</button>
                <button className="user-button" onClick={editPassword}>Edit password</button>
                <button className="user-button" onClick={editOu}>Edit OU</button>
                <button className="user-button" onClick={editDivision}>Edit Division</button>
                <button className="user-button" onClick={editRole}>Edit Role</button>
                <button className="user-button" onClick={goBack}>Back to user details</button>
            </div>
        </>
    )
}

export default ViewAll;

