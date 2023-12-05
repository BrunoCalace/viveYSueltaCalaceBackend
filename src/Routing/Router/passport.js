import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GitHubStrategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import userModel from '../../dao/models/userModel.js'
import bcrypt from 'bcrypt'
import secureKey from '../../app.js'

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email }, secureKey, { expiresIn: '1h' });
};

//LocalStrategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
  
        if (!user) {
          return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
          return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  //GithubStrategy
  passport.use('github',new GitHubStrategy(
      {
        clientID: 'Iv1.e1355fbc3e917e23',
        clientSecret: 'ce6e5c75d872453ed0a2f1a0524fd957711a915f',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await userModel.findOne({email: profile._json.email})
          if (user) {
            console.log('The user already exist');
            return done(null, user);
          }
          let name = profile._json.name.split(' ')
          const newUser = {
            first_name: name[0],
            last_name: name[1],
            email: profile._json.email,
            password: '',
          }
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.error('Error during GitHub authentication:', error);
          return done('Error to login with Github');
        }
      }
    )
  );
  
  // Serialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  export default passport
  export { generateAccessToken }