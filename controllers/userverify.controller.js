const { UserOTPVerification } = require("../models/otp.model");
const { Usermodel } = require("../models/users.model");
const bcrypt = require("bcrypt");

exports.userOtpverify = async(req,res)=>{

    try{

        let {userID,otp} = req.body;

        if(!userID || !otp){
            res.status(400).send("Verification went wrong")
        }else{
            const userotpverification = await UserOTPVerification.find({
                userID
            })
            if(userotpverification.length==0){
                res.status(400).send("Account not exist")
            }else{
                const expiresAt = userotpverification[0].expiresAt;
                const sendotp = userotpverification[0].otp;
                
                if(expiresAt < Date.now()){

                    await UserOTPVerification.deleteMany({userID})
                    res.status(500).send("Code has been expired")

                }else{
                  bcrypt.compare(otp, sendotp, async(err, result) => {
                      if(!result){
                          await Usermodel.updateOne({_id:userID},{verify:true})
                          await UserOTPVerification.deleteMany({userID})
                          res.json({
                              status:"verified",
                              "message":"user has verified"
                          })
                      }else{
                          res.status(500).send("incorrect otp")
                      }
                  });
                }
            }
        }
    }
    catch(err){
        res.send({"err":"while verify","message":err.message})
        console.log()
    }

}