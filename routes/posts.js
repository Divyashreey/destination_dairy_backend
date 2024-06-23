const router=require("express").Router();
const User=require("../models/User");
const Post=require("../models/Post");


//Create
router.post("/",async(req,res)=>{
   const newPost=new Post(req.body);
   try{
   const savedPost=await newPost.save();
   res.status(200).json(savedPost);
   }catch(err){
    res.status(500).json(err);
   }
});
 //update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete post
// router.delete("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.username === req.body.username) {
//       try {
//         await Post.deleteMany({username:post.username});
//         res.status(200).json("Post has been deleted...");
//       } catch (err) {
//        console.log(err);
//       }
//     } else {
//       res.status(401).json("You can delete only your post!");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }

    if (post.username === req.body.username) {
      try {
        // Delete the specific post by ID
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
//Get post
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
     res.status(500).json(err);
    }
});
//Get all Post
router.get("/",async (req,res)=>{
  const username=req.query.user;
  const catName=req.query.cat;
  try{
      let posts;
     if(username){
      posts=await Post.find({username});
     }else if(catName){
    posts=await Post.find({categories:{
      $in:[catName],
    },});
     }else{
      posts=await Post.find();
     }
     res.status(200).json(posts);
  }catch(err){
   res.status(500).json(err);
  }
});
module.exports = router;