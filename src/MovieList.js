import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import {Container,Grid} from "@material-ui/core";
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import {movies$} from './movies';

function getStyles(category, selectedCategories, theme) {
    return {
      fontWeight:
      selectedCategories.indexOf(category) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
export default function MovieList() {
    const theme = useTheme();
     const [moviesList, setMoviesList] = useState([]);
     const [categories, setCategories] = useState([]);
     const [alignment, setAlignment] = React.useState('Like');
     const [selectedCategories, setSelectedCategories] = useState([]);
     const [page, setPage] = React.useState(2);
     const [rowsPerPage, setRowsPerPage] = React.useState(3);
   
     useEffect(() => {
          movies$.then((result)=>{
             setMoviesList(result);
          })
       });

     useEffect (()=> {
        var categories = [];
        for (let i = 0; i < moviesList.length; i++) categories.push(moviesList[i].category);
        var uniqueCategories = [...new Set(categories)];
        setCategories(uniqueCategories)
     }, [moviesList])  

    //  useEffect(()=>{
    //      console.log('selectedCategories',selectedCategories);
    //      var filtredList = []
    //      if (selectedCategories.length>0){
    //      for (let i = 0; i < selectedCategories.length; i++){
    //         for (let j = 0; j < moviesList.length; j++){
    //             if (moviesList[j].category == filtredList[i])
    //             filtredList.push(moviesList[j]);
    //         }
    //      }
          
    //      console.log ('filtredList', filtredList);
    //      setMoviesList(filtredList);
    //      }
         
    //  }, [selectedCategories])

      const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
      };
      const deleteMovie = (id) => {
          var newList = moviesList.filter(movie => movie.id != id);
          setMoviesList(newList);
      }

      const handleChangeSearch = (event) => {
        const {
          target: { value },
        } = event;
        setSelectedCategories(
          typeof value === 'string' ? value.split(',') : value,
        );
      }; 

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

  return (
    <>
    <Container>
    <Grid>
        <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Search</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedCategories}
          onChange={handleChangeSearch}
          input={<OutlinedInput label="Category" />}
        >
          {categories.map((category) => (
            <MenuItem
              key={category}
              value={category}
              style={getStyles(category, selectedCategories, theme)}
            >
              {category}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        </Grid>
    <Grid container  spacing={3}>
        {moviesList.map(movie => (
        <Grid item xs ={12} md ={6} lg ={4}>
        <Card>
            <CardHeader
            action = {                
            <Button size="small" onClick={() => deleteMovie(movie.id)} >Delete</Button>}
            title ={movie.title}
            subheader = {movie.category}
            /> 
            <CardContent>
                <AiOutlineLike/> 
                <span>{movie.likes}</span>
                <AiOutlineDislike/> 
                <span>{movie.dislikes}</span>
            </CardContent>
             <CardActions>
                <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                >
                <ToggleButton value="like">Like</ToggleButton>
                <ToggleButton value="dislike">Dislike</ToggleButton>
                </ToggleButtonGroup>
             </CardActions>
        </Card>
        </Grid>

        ))}
    </Grid>
    <TablePagination
      component="div"
      count={100}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </Container>
    </>
  )
}