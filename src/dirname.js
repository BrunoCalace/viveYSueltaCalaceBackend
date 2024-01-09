import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email }, 'tu_secreto_secreto', { expiresIn: '1h' });
}

export default __dirname