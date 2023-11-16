import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'

class SessionsController {
    static async signup(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;
          
            const existingUser = await userModel.findOne({ email });
          
            if (existingUser) {
                return res.render('signup', { error: 'El usuario ya existe' });
            }
          
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ first_name, last_name, email, age, password: hashedPassword });
            await newUser.save();
          
            res.redirect('/');
          } catch (error) {
              console.error('Error al crear usuario:', error);
              res.render('error', { error: 'Error al crear usuario' });
          }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
    
            const user = await userModel.findOne({ email });
    
            if (!user) {
                return res.redirect('/');
            }
    
            const passwordMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    
            if (!passwordMatch) {
                return res.redirect('/');
            }
    
            req.session.userId = user._id;
            req.session.userRole = user.role;
            return res.redirect('/products');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.render('error', { error: 'Error al iniciar sesión' });
        }
    }

    static logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error al cerrar sesión:', err);
                }
            });

            return res.redirect('/')
        } catch (error) {
            res.render('error', { error: 'Error al cerrar sesión' });
        }
    }
}

export default SessionsController