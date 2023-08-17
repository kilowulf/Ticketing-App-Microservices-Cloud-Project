import express from "express";
import { currentUserSession, requireAuth } from "@qtiks/common";

/**
 * Current User:
 * - check if user has a req.session.jwt set
 * - if check fails; no jwt or invalid. return false
 * - if check succeeds; send data stored in jwt payload
 *
 */

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserSession,
  requireAuth,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
