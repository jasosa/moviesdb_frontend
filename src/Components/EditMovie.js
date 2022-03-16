import React, { Component, Fragment } from 'react'
import './EditMovie.css'
import Input from './form-components/input'
import TextArea from './form-components/textarea'
import Select from './form-components/select'
import Alert from './ui-components/Alert'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class EditMovie extends Component {

    constructor(props){
        super(props)
        this.state = {
            movie: {
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "R",
                rating: "",
                description: "",
            },
            mpaaOptions: [
                {id: "G", value: "G"},
                {id: "PG", value: "PG"},
                {id: "PG13", value: "PG13"},
                {id: "R", value: "R"},
                {id: "NC17", value: "NC17"},
            ],
            isLoaded:  false,
            error: null,
            errors: [],
            alert: {
                type: 'd-none',
                message: "",
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        //client side validation
        let errors = [];
        if (this.state.movie.title === ""){
            errors.push("title");
        }

        this.setState({errors: errors})

        if (errors.length > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        console.log(payload); 

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
        }

        fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error){
                this.setState({
                    alert: {type:"alert-danger", message: data.error.message},
                })
            } else {
                console.log("success")
                this.props.history.push({
                    pathname: "/admin"
                })
            }
        })
    }


    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState) => ({
            movie: {
                ...prevState.movie,
                [name]:value, 
            }
        }))
        evt.preventDefault();
    }

    hasError(key){
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount(){
        const id = this.props.match.params.id;
        if (id > 0){
            fetch("http://localhost:4000/v1/movie/" + id)  
            .then((response) => {
                if(response.status !== "200"){
                    let err = Error;
                    err.message = "Invalid response code: " + response.status;
                    this.setState({error: err}); 
                }

                return response.json();
            })
            .then((json) => {
                const releaseDate = new Date(json.movie.release_date);
                this.setState({
                    movie: {
                        id: id,
                        title: json.movie.title,
                        releaseDate: releaseDate.toISOString().split("T")[0],
                        runtime: json.movie.runtime,
                        mpaa_rating: json.movie.mpaa_rating,
                        rating: json.movie.rating,
                        description: json.movie.description,
                    },
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                });
            });
        } 
        else{
            this.setState({
                isLoaded: true,                
            })
        }
    }


    confirmDelete (){
        console.log("would delete movie id", this.state.movie.id);

        confirmAlert({
            title: 'Delete Movie?',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    fetch("http://localhost:4000/v1/admin/deletemovie/" + this.state.movie.id, {method: "GET"})
                    .then(response => response.json)
                    .then(data => {
                        if (data.error){
                            this.setState({
                                alert: {type:"alert-danger", message: data.error.message}
                            })
                        } else {
                            this.props.history.push({
                                pathname: "/admin"
                            })
                        }
                    })
                }
              },
              {
                label: 'No',
                onClick: () => alert('Click No')
              }
            ]
          });
    }

    render() {
        let {movie, isLoaded, error} = this.state;

        if (error){
            return <div>Error: {error.message}</div>
        }
        else if (!isLoaded){
            return <p>Loading...</p>
        } else {
            return(
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert
                        type={this.state.alert.type}
                        message={this.state.alert.message}
                    />
                    <hr />
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="hidden"
                            name="id"
                            value={movie.id}
                            onChange={this.handleChange}
                        ></input>
                        <Input
                            title={'Title'}
                            type={'text'}
                            name={'title'}
                            value={movie.title}                            
                            handleChange={this.handleChange}
                            className={this.hasError("title") ? "is-invalid" : ""}
                            errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a title"}
                        ></Input>
                        <Input
                            title={'Release Date'}
                            type={'date'}
                            name={'release_date'}
                            value={movie.releaseDate}
                            handleChange={this.handleChange}
                        ></Input>
                        <Input
                            title={'Runtime'}
                            type={'text'}
                            name={'runtime'}
                            value={movie.runtime}
                            handleChange={this.handleChange}
                        ></Input>                   
                        <Select
                            title={'MPAA Rating'}
                            name={'mpaa_rating'}
                            options={this.state.mpaaOptions}
                            value={movie.mpaa_rating}
                            handleChange={this.handleChange}
                            placeholder={'Choose...'}                         
                        ></Select>
                        <Input
                            title={'Rating'}
                            type={'text'}
                            name={'rating'}
                            value={movie.rating}
                            handleChange={this.handleChange}
                        ></Input>   
                        <TextArea
                        title={'Description'}
                        type={'text'}
                        name={'description'}
                        value={movie.description}
                        rows={'3'}
                        handleChange={this.handleChange}
                        ></TextArea>                    

                        <hr />

                        <button className='btn btn-primary'>Submit</button>
                        <Link to="/admin" className="btn btn-warning ms-1">
                            Cancel
                        </Link>
                        {movie.id > 0 && (
                            <a href='#!' onClick={() => this.confirmDelete()}
                            className="btn btn-danger ms-1">Delete</a>
                        )}
                    </form>

                    <hr />
                </Fragment>
            )
        }
    }
}