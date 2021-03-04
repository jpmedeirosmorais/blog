// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
// Configurações
    // Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middlware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })    
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true}}))
    app.set('view engine', 'handlebars')
    
    
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log('Conectado ao servidor.')
        }).catch((err) => {
            console.log('Erro ao se conectar ao servidor'+err)
        })
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

        
// Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate('categorias').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})

        }).catch((err) => {
            req.flash('error_msg', err)
            res.redirect('/404')
        })
        
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg','Esta postagem não existe.')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })

    })
    app.get('/categorias', (req, res) => {
        Categoria.find().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg','Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens)=>{
                    res.render('categorias/postagens', {postagens: postagens, categoria:categoria})
                }).catch((err) => {
                    req.flash('error_msg','Houve um erro interno')
                    res.redirect('/categorias')
                })
            }else{
                req.flash('error_msg','Houve um erro interno')
                res.redirect('/categorias')
            }
        }).catch((err) => {
            req.flash('error_msg','Houve um erro interno!')
            res.redirect('/categorias')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })


    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
   
// Outros
const PORT = 8081
app.listen(PORT,() => {
    console.log('Servidor rodando.')
})