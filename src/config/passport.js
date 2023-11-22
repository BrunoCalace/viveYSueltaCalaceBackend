import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GitHubStrategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'


const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email }, 'tu_secreto_secreto', { expiresIn: '1h' });
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
  passport.use(
    new GitHubStrategy(
      {
        clientID: 'Iv1.e1355fbc3e917e23',
        clientSecret: 'ce6e5c75d872453ed0a2f1a0524fd957711a915f',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        failureFlash: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  
          if (!email) {
            return done(null, false, { message: 'No se proporcionó un correo electrónico desde GitHub' });
          }
  
          let user = await userModel.findOne({ email });
  
          if (!user) {
            user = await userModel.create({
              email,
            });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error, false, { message: 'Error durante la autenticación de GitHub' });
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