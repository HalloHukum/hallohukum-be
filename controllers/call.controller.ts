import { Request, Response } from "express";

import CallService from "../services/call.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCallRequest:
 *       type: object
 *       required:
 *         - clientId
 *         - lawyerId
 *       properties:
 *         clientId:
 *           type: string
 *           description: ID of the client user
 *         lawyerId:
 *           type: string
 *           description: ID of the lawyer user
 *     CallResponse:
 *       type: object
 *       properties:
 *         callId:
 *           type: string
 *           description: Unique identifier for the call
 */

export default class CallController {
  /**
   * @swagger
   * /calls/video:
   *   post:
   *     summary: Create a new video/audio call between client and lawyer
   *     tags: [Calls]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCallRequest'
   *     responses:
   *       201:
   *         description: Call created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Call created successfully
   *                 data:
   *                   $ref: '#/components/schemas/CallResponse'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: clientId and lawyerId are required
   *       401:
   *         description: Unauthorized - User not authenticated
   *       500:
   *         description: Server error
   */
  static async createCall(req: Request, res: Response) {
    try {
      const { clientId, lawyerId } = req.body;

      const result = await CallService.createCall(clientId, lawyerId);

      res.status(201).json({
        status: "success",
        message: "Call created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  /**
   * @swagger
   * /calls/voice:
   *   post:
   *     summary: Create a new voice call between client and lawyer
   *     tags: [Calls]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCallRequest'
   *     responses:
   *       201:
   *         description: Voice call created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Voice created successfully
   *                 data:
   *                   $ref: '#/components/schemas/CallResponse'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: clientId and lawyerId are required
   *       401:
   *         description: Unauthorized - User not authenticated
   *       500:
   *         description: Server error
   */
  static async createVoice(req: Request, res: Response) {
    try {
      const { clientId, lawyerId } = req.body;

      const result = await CallService.createVoice(clientId, lawyerId);

      res.status(201).json({
        status: "success",
        message: "Voice created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }
}
