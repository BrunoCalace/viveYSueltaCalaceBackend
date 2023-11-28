import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GitHubStrategy } from 'passport-github'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import secureKey from '../app.js'

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
  passport.use(
    new GitHubStrategy(
      {
        clientID: 'Iv1.e1355fbc3e917e23',
        clientSecret: 'ce6e5c75d872453ed0a2f1a0524fd957711a915f',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email'],
        failureFlash: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const githubEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

          if (githubEmail) {
          const user = await userModel.findOne({ email: githubEmail });

          if (!user) {
            const newUser = await userModel.create({
              email: githubEmail,
            });

            console.log('GitHub authentication successful - User created:', newUser)
            return done(null, newUser);
          }

          console.log('GitHub authentication successful - User found:', user)
          return done(null, user);
          } else {
            const requestedEmail = 'user@example.com'

            const user = await userModel.findOne({ email: requestedEmail })

            if (!user) {
              const newUser = await userModel.create({
                email: requestedEmail,
              });

              console.log('GitHub authentication successful - User created with requested email:', newUser);
              return done(null, newUser);
            }

            console.log('GitHub authentication successful - User found with requested email:', user);
            return done(null, user);
          }
      } catch (error) {
        console.log('GitHub authentication failed');
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