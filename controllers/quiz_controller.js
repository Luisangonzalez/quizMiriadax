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
  var options =  '%'+req.query.search+'%';
  if(req.user){
    options.where = {UserId: req.user.id};
  }

  if(req.query.search){
    models.Quiz.findAll({
		 where: ["pregunta like ?", options],
		 order: [['pregunta', 'ASC']]}
		 ).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});
	}).catch(function(error) {next(error);});
  }else {
    models.Quiz.findAll({order:[['pregunta', 'ASC']]}).then(function(quizes) {
    		res.render('quizes/index', {quizes: quizes, errors: []});
        }).catch(function(error) {next(error);});
  }

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

//GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {
      pregunta: "Pregunta",
      respuesta: "Respuesta",
      tema: "tema"
    }
  );
  res.render('quizes/new',{quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
var quiz = models.Quiz.build( req.body.quiz );
   var errors=quiz.validate();
 if (errors)
  {
    var i=0;
    var errores=[];

    for (var prop in errors) {
      errores[i++]={message:errors[prop]};
    }
      res.render('quizes/new', {quiz: quiz, errors: errores});
    }
     else	{
        // guarda en DB los campos pregunta y respuesta de quiz
          quiz.save({fields: ["pregunta", "respuesta", "tema"]})
          .then(function() { res.redirect('/quizes')});
        }
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // Autoload quiz instance
  var err = {errors: "Hello erros!"};
  res.render('quizes/edit', {quiz: quiz,  errors: err.errors});
};


/*  ¿?¿ no run
//PUT /quizes/:id
exports.update = function(req, res) {
  //var quiz = models.Quiz.build( req.body.quiz);
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
//var errors=quiz.validate();

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else {
        req.quiz
        .save( {fields: ["pregunta", "respuesta"]})
        .then(function(){ res.rediret('/quizes');});
      }
    }
  );

};
*/


// PUT /quizes/:id
   exports.update = function(req, res) {
	 req.quiz.pregunta  = req.body.quiz.pregunta;
	 req.quiz.respuesta = req.body.quiz.respuesta;
   req.quiz.tema = req.body.quiz.tema;
	 //req.quiz.tema = req.body.quiz.tema;
	 var quiz = models.Quiz.build( req.body.quiz);
	  var errors=quiz.validate();
	  if (errors)
	   {
	 	var i=0;
    var errores = [];
	 	for (var prop in errors) {
	 		errores[i++]={message:errors[prop]};
	 	}
	 	res.render('quizes/edit', {quiz: quiz, errors: errores});
	 } else	{
	// save: guarda en DB los campos pregunta y respuesta de quiz
	req.quiz
	.save({fields: ["pregunta", "respuesta", "tema"]}).then(function()
		{ res.redirect('/quizes');
	}); // Redireccion HTTP (URL relativo)  lista de preguntas
}
};


//Get /author
exports.author = function(req, res){
  var err = {errors: "Hello erros!"};
  res.render('author', {errors: err.errors});
};
