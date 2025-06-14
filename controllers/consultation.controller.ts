import { Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import Consultation from "../models/consultation.model";
import Lawyer from "../models/lawyer.model";
import User from "../models/user.model";
import ConsultationService from "../services/consultation.service";
import PushNotificationService from "../services/notification.service";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultation:
 *       type: object
 *       required:
 *         - userId
 *         - lawyerId
 *         - categoryId
 *         - caseType
 *         - problemDescription
 *         - legalBasis
 *         - analysis
 *         - conclusionAndAdvice
 *         - chatId
 *         - disclaimer
 *         - expiredAt
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the consultation
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The user's ID
 *             fullName:
 *               type: string
 *               description: Full name of the user
 *             email:
 *               type: string
 *               description: Email address of the user
 *             role:
 *               type: string
 *               description: Role of the user (user/lawyer)
 *           description: User data of the consultation creator
 *         lawyerId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The lawyer's ID
 *             specialization:
 *               type: array
 *               items:
 *                 type: string
 *               description: Areas of legal expertise
 *             yearsOfExperience:
 *               type: number
 *               description: Number of years of legal experience
 *             certifications:
 *               type: array
 *               items:
 *                 type: string
 *               description: Professional certifications
 *             qualification:
 *               type: string
 *               description: Professional qualifications
 *             about:
 *               type: string
 *               description: Brief description about the lawyer
 *             image:
 *               type: string
 *               description: Profile image URL
 *             isVerified:
 *               type: boolean
 *               description: Whether the lawyer is verified
 *             status:
 *               type: string
 *               enum: [online, offline]
 *               description: Current availability status
 *             price:
 *               type: number
 *               description: Consultation price
 *             totalConsults:
 *               type: number
 *               description: Total number of consultations completed
 *             userId:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The lawyer's user ID
 *                 fullName:
 *                   type: string
 *                   description: Full name of the lawyer
 *                 email:
 *                   type: string
 *                   description: Email address of the lawyer
 *                 role:
 *                   type: string
 *                   description: Role of the lawyer (lawyer)
 *               description: User data of the lawyer
 *           description: Full lawyer data including user information
 *         categoryId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The category's ID
 *             title:
 *               type: string
 *               description: Title of the legal category
 *           description: The category of the legal consultation
 *         caseType:
 *           type: string
 *           description: Type of legal case
 *         problemDescription:
 *           type: string
 *           description: Detailed description of the legal problem
 *         method:
 *           type: string
 *           enum: [chat, call, video]
 *           description: Consultation method
 *         legalBasis:
 *           type: string
 *           description: Legal basis for the consultation
 *         analysis:
 *           type: string
 *           description: Legal analysis of the case
 *         conclusionAndAdvice:
 *           type: string
 *           description: Final conclusion and legal advice
 *         chatId:
 *           type: string
 *           description: Reference to the associated chat
 *         disclaimer:
 *           type: string
 *           description: Legal disclaimer
 *         durationMinutes:
 *           type: number
 *           minimum: 0
 *           description: Duration of the consultation in minutes
 *         expiredAt:
 *           type: string
 *           format: date-time
 *           description: Expiration date of the consultation
 *         status:
 *           type: string
 *           enum: [active, expired]
 *           description: Current status of the consultation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *     ConsultationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Consultation created successfully
 *         data:
 *           $ref: '#/components/schemas/Consultation'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Consultation not found
 */

export default class ConsultationController {
  /**
   * @swagger
   * /consultations:
   *   post:
   *     summary: Create a new consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - lawyerId
   *               - categoryId
   *               - caseType
   *               - problemDescription
   *               - legalBasis
   *               - analysis
   *               - conclusionAndAdvice
   *               - chatId
   *               - disclaimer
   *               - durationMinutes
   *               - expiredAt
   *             properties:
   *               lawyerId:
   *                 type: string
   *                 example: "60d21b4667d0d8992e610c85"
   *               categoryId:
   *                 type: string
   *                 example: "criminal_law"
   *               caseType:
   *                 type: string
   *                 example: "Criminal Case"
   *               problemDescription:
   *                 type: string
   *                 example: "Need legal advice regarding a criminal case"
   *               method:
   *                 type: string
   *                 enum: [chat, call, video]
   *                 example: "chat"
   *               legalBasis:
   *                 type: string
   *                 example: "Based on Criminal Code Article 123"
   *               analysis:
   *                 type: string
   *                 example: "Initial analysis of the case"
   *               conclusionAndAdvice:
   *                 type: string
   *                 example: "Legal advice and conclusion"
   *               chatId:
   *                 type: string
   *                 example: "chat_123"
   *               disclaimer:
   *                 type: string
   *                 example: "Legal disclaimer text"
   *               durationMinutes:
   *                 type: number
   *                 minimum: 0
   *                 example: 60
   *               expiredAt:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-12-31T23:59:59Z"
   *     responses:
   *       201:
   *         description: Consultation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   */
  static async createConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const lawyerId = req.body.lawyerId;
      const durationMinutes = req.body.durationMinutes || 60;
      const expiredAt = await ConsultationService.getExpiredAt(durationMinutes); // output:

      const consultation: any = await ConsultationService.createConsultation({
        ...req.body,
        userId: req.user._id,
        lawyerId,
        status: "pending",
        durationMinutes,
        expiredAt,
      });
      // console.log(consultation?._id.toString(), "<-- nih dari si response create transaction");
      const consultationId = consultation?._id.toString();
      // console.log(consultationId, "<-- consultation id nihh")

      const lawyer = await Lawyer.findById(lawyerId).populate("userId");
      if (
        lawyer &&
        lawyer.userId &&
        typeof lawyer.userId === "object" &&
        "pushTokens" in lawyer.userId
      ) {
        const user = lawyer.userId as unknown as IUser;
        if (user.pushTokens && user.pushTokens.length > 0) {
          await PushNotificationService.sendNotification(
            user.pushTokens,
            "Permintaan Konsultasi Baru!",
            `Client mengajukan konsultasi!.`,
            {
              data: {
                consultationId: consultationId,
              },
            }
          );
          // console.log(notifResp, "<-- notif look like")
        }
      }
      res.status(201).json({
        status: "success",
        message: "Consultation created successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations:
   *   get:
   *     summary: Get all consultations with optional filters
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         description: Filter by user ID
   *       - in: query
   *         name: lawyerId
   *         schema:
   *           type: string
   *         description: Filter by lawyer ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, expired]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of consultations
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
   *                   example: Consultations retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Consultation'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getConsultations(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultations = await ConsultationService.getConsultations({
        ...req.query,
        userId: req.user._id.toString(),
      });
      res.status(200).json({
        status: "success",
        message: "Consultations retrieved successfully",
        data: consultations,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   get:
   *     summary: Get a consultation by ID
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     responses:
   *       200:
   *         description: Consultation found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Consultation not found
   */
  static async getConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultation = await ConsultationService.getConsultationById(
        req.params.id
      );
      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation retrieved successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/channels/{id}:
   *   get:
   *     summary: Get consultation details by chat ID
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Chat ID to find the consultation
   *     responses:
   *       200:
   *         description: Consultation found
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
   *                   example: Consultation retrieved successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     chatId:
   *                       type: string
   *                       example: "chat_123"
   *                     expiredAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-12-31T23:59:59Z"
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Consultation not found
   */
  static async getConsultationByChatId(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultation = await ConsultationService.getConsultationByChatId(
        req.params.id
      );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        consultation.id.toString(),
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation retrieved successfully",
        data: {
          consultationId: consultation._id,
          chatId: consultation.chatId,
          expiredAt: consultation.expiredAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  static async respondConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }
      const { consultationId, action } = req.body;

      if (!["accept", "decline"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }

      consultation.status = action === "accept" ? "accepted" : "declined";
      await consultation.save();

      // Optional: send notif ke client
      const client = await User.findById(consultation.userId);
      if (client?.pushTokens && client.pushTokens.length > 0) {
        await PushNotificationService.sendNotification(
          client.pushTokens,
          "Status Konsultasi",
          `Konsultasi kamu telah di-${action === "accept" ? "terima" : "tolak"}`
        );
      }

      res.status(200).json({ status: "success", data: consultation });
    } catch (error) {
      console.error("Error in respondConsultation:", error);
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   put:
   *     summary: Update a consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [active, expired]
   *                 example: expired
   *               analysis:
   *                 type: string
   *                 example: "Updated analysis"
   *               conclusionAndAdvice:
   *                 type: string
   *                 example: "Updated conclusion"
   *     responses:
   *       200:
   *         description: Consultation updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async updateConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      const consultation = await ConsultationService.updateConsultation(
        req.params.id,
        req.body
      );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation updated successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   delete:
   *     summary: Delete a consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     responses:
   *       200:
   *         description: Consultation deleted successfully
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
   *                   example: Consultation deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async deleteConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      const consultation = await ConsultationService.deleteConsultation(
        req.params.id
      );
      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  // /consultations/{id}/end swagger doc

  // endConsultation function
  /**
   * @swagger
   * /consultations/{id}/end:
   *   patch:
   *     summary: End a consultation by marking it as expired
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     responses:
   *       200:
   *         description: Consultation ended successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async endConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultation = await ConsultationService.endConsultation(
        req.params.id
      );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation ended successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}/chat:
   *   patch:
   *     summary: Update consultation chat channel
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - chatId
   *             properties:
   *               chatId:
   *                 type: string
   *                 description: The chat channel ID to associate with the consultation
   *     responses:
   *       200:
   *         description: Chat channel updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async updateConsultationChatChannel(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const { chatId } = req.body;
      if (!chatId) {
        return res.status(400).json({
          status: "error",
          message: "Chat ID is required",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      const consultation =
        await ConsultationService.updateConsultationChatChannel(
          req.params.id,
          chatId
        );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation chat channel updated successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
