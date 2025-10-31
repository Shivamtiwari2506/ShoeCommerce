import WishList from "../Models/wishListModels.js";

const wishlistControlers = {
      addToWishlist: async (req, res) => {
         const {userId, shoeId} = req.body;
         try {
            if(!userId || !shoeId) {
               return res.status(400).json({success: false, error: "userId and shoeId are required"});
            }
            const userWishlist = await WishList.findOne({userId});
            if(!userWishlist) {
               const newWishlist = new WishList({userId, products: [{shoeId}]});
               await newWishlist.save();
            }
            else {
               const productIndex = userWishlist.products.findIndex((p) => p?.shoeId?.toString() === shoeId);
               if(productIndex > -1) {
                  res.status(200).json({success: true, message: "Item already added to wishlist"});
               }
               else {
                  userWishlist?.products?.push({shoeId});
                  await userWishlist.save();
                  res.status(200).json({success: true, message: "Item added to wishlist"});
               }
            }
         } catch (error) {
            res.status(500).json({success: false, error: error.message});
         }
      },
      getUserWishist: async (req, res) => {
         const {userId} = req?.query;
         try {
            if(!userId) {
               return res.status(400).json({success: false, error: "userId is required"});
            }
            const userWishlist = await WishList.findOne({userId})?.populate("products.shoeId");
            res.status(200).json({success: true, wishlist: userWishlist || []});
         } catch (error) {
            res.status(500).json({success: false, error: error.message});
         }
      }
}

export default wishlistControlers;