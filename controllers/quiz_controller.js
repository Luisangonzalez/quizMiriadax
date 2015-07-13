var models = require('../models/models.js');

// Autoload - refactoring if routes no include : quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz){
        req.quiz = quiz;
        next();
      }else {
        next(new Error('No existe quizId='+quizId));
        }
    }
  ).catch(function(error) { next(error); });
};


// GET /quizes
// GET /users/:userId/quizes
exports.index = function(req, res) {
  var options = {where: ["pregunta like ?", '%'+req.query.search+'%']};
  if(req.user){
    options.where = {UserId: req.user.id};
  }

  models.Quiz.findAll(options).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error);});
};

//Get /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//Get /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer',
   { quiz: req.quiz,
      respuesta: resultado,
      errors: []
    });
};
/*
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).success(function(quiz) {
    if(req.query.respuesta === quiz.respuesta){
      res.render('quizes/answer',
      {quiz: quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer',
       {quiz: quiz,respuesta: 'Incorrecto'});
    }
  });
};
*/
//Get /author
exports.author = function(req, res){
  res.render('author');
};
