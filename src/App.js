import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, FormControl } from 'react-bootstrap';
import spinner from './spinner.gif';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      search: '',
      resource: 'people',
      schema: '',
      data: {},
      loading: true,
    }
    this.schemas = {
      people: '',
      films: '',
      starships: '',
      vehicles: '',
      species: '',
      planets: ''
    }

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.search = this.search.bind(this);
    this.handleResourceChange = this.handleResourceChange.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);

  }

  componentDidMount(){
    var resources = ["films", "starships", "vehicles", "species", "planets"];

    //initially display people
    axios.get("https://swapi.co/api/people/")
    .then(data => {
      this.setState({
        data: data.data,
        loading: false
      });
      console.log(data.data);
    })
    .catch(error => {
      console.error(error);
    })

    //initially display people
    axios.get("https://swapi.co/api/people/schema")
    .then(data => {
      this.schemas.people = data.data;
      this.setState({
        schema: this.schemas.people
      })
      console.log(data.data);
    })
    .catch(error => {
      console.error(error);
    })

    //fetch schemas
    resources.forEach(resource => {
      axios.get("https://swapi.co/api/" + resource + "/schema")
      .then(data => {
        this.schemas[resource] = data.data;
        console.log(data.data);
      })
      .catch(error => {
        console.error(error);
      })
    })


  }

  handleResourceChange(event){
    this.setState({
      resource: event.target.value,

    });
  }

  handleSearchChange(event){
    this.setState({
      search: event.target.value
    })
  }

  search(){
    this.setState({
      loading: true
    });
    var url = "https://swapi.co/api/" + this.state.resource;
    if(this.state.search !== ''){
      url += "?search=" + this.state.search;
    }
    axios.get(url)
    .then(data => {
      this.setState({
        schema: this.schemas[this.state.resource],
        data: data.data,
        loading: false
      });
      console.log(data.data);
    })
    .catch(error => {
      console.error(error);
    })

  }

  handleNextClick(){
    this.setState({
      loading: true
    });
    axios.get(this.state.data.next)
    .then(data => {
      this.setState({
        data: data.data,
        loading: false
      });
      console.log(data.data);
    })
    .catch(error => {
      console.error(error);
    })

  }
  handlePreviousClick(){
    this.setState({
      loading: true
    });
    axios.get(this.state.data.previous)
    .then(data => {
      this.setState({
        data: data.data,
        loading: false
      });
      console.log(data.data);
    })
    .catch(error => {
      console.error(error);
    })
  }

  render() {
    return (
      <div className="App">
        <div className="form-inline">
        <FormControl componentClass="select" onChange={this.handleResourceChange} value={this.state.resource} style={{"width": "200px"}} >
          <option value="people">People</option>
          <option value="films">Films</option>
          <option value="starships">Starships</option>
          <option value="vehicles">Vehicles</option>
          <option value="species">Species</option>
          <option value="planets">Planets</option>
        </FormControl>
        <FormControl
          name="search"
          placeholder="Search"
          type="text"
          style={{"width": "200px"}}
          value={this.state.search}
          onChange={this.handleSearchChange}
          >

        </FormControl>
        <Button
          type="button"
          onClick={this.search}
          >
          Search
        </Button>
        {typeof this.state.data.previous !== 'undefined' && this.state.data.previous !== null ? (
          <Button
            onClick={this.handlePreviousClick}
            >Previous</Button>
        ): '' }
        {typeof this.state.data.next !== 'undefined' && this.state.data.next !== null ? (
          <Button
            onClick={this.handleNextClick}
            >Next</Button>
        ): '' }
        {this.state.loading ? (<img alt='' src={spinner} height="30" width="30" />) : ''}


        </div>
        <div>
          {this.state.schema && typeof this.state.data.results !== 'undefined' ? (
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                {this.state.schema.required.map(element =>
                  <th
                    title={this.state.schema.properties[element].description}
                    key={element}>{element}</th>
                )}
                </tr>
              </thead>
              <tbody>
                  {this.state.data.results.map((value, key) =>
                    <tr key={key}>
                      {this.state.schema.required.map(element =>
                        <td
                          title={this.state.schema.properties[element].description}
                          key={element}>{this.state.data.results[key][element]}</td>
                      )}
                      </tr>
                      )
                  }
              </tbody>
            </Table>
          ) : ''}
        </div>
      </div>
    );
  }
}

export default App;
