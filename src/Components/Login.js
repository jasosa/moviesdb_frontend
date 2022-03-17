import React , {Component, Fragment} from 'react'
import Alert from './ui-components/Alert';
import Input from './form-components/input';

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            error: null,
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }  
    
    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState) => ({
                ...prevState,
                [name]:value, 
        }))
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
    }

    hasError(key){
        return this.state.errors.indexOf(key) !== -1;
    }

    render(){
        return(
            <Fragment>
                <h2>Login</h2>
                <hr></hr>
                <Alert
                    type={this.state.alert.type}
                    message={this.state.alert.message}
                    />
                
                <form className='pt-3' onSubmit={this.handleSubmit}>
                    <Input
                        title={"Email"}
                        type={"email"}
                        name={"email"}
                        handleChange={this.handleChange}
                        className={this.hasError("email") ? "is-invalid" : ""}
                            errorDiv={this.hasError("email") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a valid email address"}
                    ></Input>
                    <Input
                        title={"Password"}
                        type={"password"}
                        name={"password"}
                        handleChange={this.handleChange}
                        className={this.hasError("password") ? "is-invalid" : ""}
                            errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a password"}
                    ></Input>

                    <hr />
                    <button className='btn btn-primary'>Login</button>
                </form>
            </Fragment>
        )
    }
}
