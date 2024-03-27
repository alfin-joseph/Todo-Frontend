// authService.js


export const login = async (username, password) => {
    const url = 'http://127.0.0.1:8000/api/token/';
    const data = {
        username: username,
        password: password
    };
    
    // Configuring the fetch options
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    // Making the POST request and returning the promise
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here
            return data;
        })
        .catch(error => {
            // Handle errors here
            console.error('There was a problem with the fetch operation:', error);
            // Re-throw the error to be caught by the caller
            throw error;
        });
};


export const logout = () => {
    localStorage.removeItem('token');
    window.location.reload()
};

export const getToken = () => {
    console.log(localStorage.getItem('token'))
    return localStorage.getItem('token');
};

export const isLoggedIn = () => {
    if(getToken()){
        return true
    }else{
        return false
    }
};
