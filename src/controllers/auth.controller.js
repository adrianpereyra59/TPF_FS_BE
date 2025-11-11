import ENVIRONMENT from "../config/environment.config.js";
import AuthService from "../services/auth.service.js";
import { ServerError } from "../utils/customError.utils.js";

class AuthController {
  static async register(request, response) {
    try {
      const { username, email, password } = request.body;
      if (!username) throw new ServerError(400, "Debes enviar un nombre de usuario valido");
      if (!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        throw new ServerError(400, "Debes enviar un email valido");
      if (!password || password.length < 8) throw new ServerError(400, "Debes enviar una contraseña valida");

      await AuthService.register(username, password, email);

      response.json({
        ok: true,
        status: 200,
        message: "Usuario registrado correctamente",
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }

  static async login(request, response) {
    try {
      const { email, password } = request.body;
      const { authorization_token } = await AuthService.login(email, password);

      return response.json({
        ok: true,
        message: "Logueado con exito",
        status: 200,
        data: {
          token: authorization_token,
          authorization_token: authorization_token,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }


  static async verifyEmail(request, response) {
    try {
      const { verification_token } = request.params;
      await AuthService.verifyEmail(verification_token);

      const acceptsJson = request.headers.accept && request.headers.accept.includes("application/json");
      if (acceptsJson) {
        return response.json({ ok: true, status: 200, message: "Email verificado" });
      }

      const front = ENVIRONMENT.URL_FRONTEND || "/";
      return response.redirect(`${front.replace(/\/$/, "")}/login`);
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }

  
  static async verifyEmailPost(request, response) {
    try {
      const { verification_token } = request.body;
      if (!verification_token) {
        return response.status(400).json({ ok: false, status: 400, message: "verification_token requerido" });
      }
      await AuthService.verifyEmail(verification_token);
      return response.json({ ok: true, status: 200, message: "Email verificado" });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }

  static async forgotPassword(request, response) {
    try {
      const { email } = request.body;
      if (!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ServerError(400, "Debes enviar un email válido");
      }
      await AuthService.forgotPassword(email);
      return response.json({ ok: true, status: 200, message: "Se ha enviado un correo con las instrucciones para recuperar tu contraseña" });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }

  static async resetPassword(request, response) {
    try {
      const { reset_token, new_password } = request.body;
      if (!reset_token) throw new ServerError(400, "Token de recuperación requerido");
      if (!new_password || new_password.length < 8) throw new ServerError(400, "La contraseña debe tener al menos 8 caracteres");
      await AuthService.resetPassword(reset_token, new_password);
      return response.json({ ok: true, status: 200, message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }

  static async me(request, response) {
    try {
      const u = request.user; 
      return response.json({ ok: true, status: 200, data: { user: u } });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
    }
  }
}

export default AuthController;