export function signup(req, res){
    const {email, fullName, passsword } = req.body;
    try{

    }
    catch(error){
        
    }
}

export function login(req, res){
    res.send("Login route");
}

export function logout(req, res){
    res.send("Logout route");
}

