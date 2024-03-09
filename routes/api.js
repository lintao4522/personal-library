/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const {Schema}=mongoose;
const bookSchema=new Schema({
  title:{type:String,required:true},
  comments:[{ type: String}],
  commentcount:Number
  
});
const bookModel=mongoose.model('book',bookSchema);




module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res)=>{
      
      const books=await bookModel.find();
      res.json(books);
      
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res)=>{
      let title = req.body.title;
      if (title){
      const book=new bookModel({title});
      book.comments=[];
      book.commentcount=book.comments.length;
      await book.save();
      return res.json({_id:book._id,title:book.title})
    }else {res.send('missing required field title')}
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async(req, res)=>{
      try{await bookModel.deleteMany({});
    res.json('complete delete successful')}
      catch(err){

      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res)=>{
      let bookid = req.params.id;
      try{
        const book =await bookModel.findById(bookid);
        if(book){return res.json(book)}
        else{return res.json('no book exists')}
        
      }
      catch(err){res.json('no book exists')}
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async(req, res)=>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      try{const book=await bookModel.findById(  
        bookid
     );
     if(!book){return res.json('no book exists')}
     if (!comment){return res.json('missing required field comment')}
      book.comments.push(comment);
      book.commentcount=book.comments.length;
      
      
      await book.save();
      res.json(book);}
      catch(err){return res.json('no book exists')}
      //json res format same as .get
    })
    
    .delete(async(req, res)=>{
      let bookid = req.params.id;
      try{const book=await bookModel.findByIdAndDelete(bookid);
        if(book){res.send('delete successful')}
        else{res.json('no book exists')}
      }
      catch(err){res.json('no book exists')}
      //if successful response will be 'delete successful'
    });
  
};
