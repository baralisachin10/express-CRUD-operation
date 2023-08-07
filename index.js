const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]


//to get the all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});



//to get the single course with the help of given id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('The course with given courseId is not found');
    }
    res.send(course);
})


//to post the new course

app.post('/api/courses', (req, res) => {

    //user input validation with the help of joi package
    const result = validateCourse(req.body);

    if (result.error) {
        return res.status(404).send(result.error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        body: req.body.name
    }
    courses.push(course);
    res.send(course);
});


// to update the courses

app.put('/api/courses/:id', (req, res) => {

    //look up for the course
    const course = courses.find(c => c.id === parseInt(req.params.id));

    // if not existing , return 404
    if (!course) return res.status(404).send('The courses does not exist');

    //validate
    const result = validateCourse(req.body);

    // if invalid, return 400 -> bad request
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }

    // update course
        course.name = req.body.name;

    // return the updated course
    res.send(course);
});


// seperate function for validation

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(course,schema);
}


// to delete the courses

app.delete('/api/courses/:id',(req,res)=>{
    // look up for the courses
    const course = courses.find(c => c.id == parseInt(req.params.id));
    // if not found -> return 404
    if(!course){
        return res.status(404).send('The courses not found');
    }
    // delete the courses
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // send response
    res.send(course);
})


// app.get('/api/posts/:year/:month',(req,res)=>{
//     res.send(req.query);
// })

app.listen(port, () => {
    console.log(`listening to ${port}...`);
});