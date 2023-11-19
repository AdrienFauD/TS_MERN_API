import { cleanEnv } from "envalid";
import {str, port} from "envalid/dist/validators"

export default cleanEnv(process.env, {
    ATLAS_URI : str(),
    PORT : port(),
    SESSION_SECRET : str()
}) 