import { Request, Response } from "express";

import Lawyer from "../models/lawyer.model";
import LawyerService from "../services/lawyer.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User's ID
 *         fullName:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         city:
 *           type: string
 *           description: User's city
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: User's gender
 *
 *     LawyerRequest:
 *       type: object
 *       required:
 *         - userId
 *         - specialization
 *         - yearsOfExperience
 *         - image
 *         - price
 *         - status
 *       properties:
 *         userId:
 *           type: string
 *           description: Reference to the user ID
 *         specialization:
 *           type: array
 *           items:
 *             type: string
 *           description: Lawyer's areas of specialization
 *         yearsOfExperience:
 *           type: number
 *           minimum: 0
 *           description: Number of years of experience
 *         certifications:
 *           type: array
 *           items:
 *             type: string
 *           description: List of lawyer's certifications
 *         qualification:
 *           type: string
 *           description: Lawyer's qualification (e.g. education degree)
 *         about:
 *           type: string
 *           description: Brief description about the lawyer
 *         image:
 *           type: string
 *           description: URL to lawyer's profile image
 *         status:
 *           type: string
 *           enum: [online, offline]
 *           description: Lawyer's availability status
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Consultation price
 *
 *     LawyerResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Lawyer's ID
 *         userId:
 *           $ref: '#/components/schemas/UserResponse'
 *           description: Full user profile data (populated)
 *         specialization:
 *           type: array
 *           items:
 *             type: string
 *           description: Lawyer's areas of specialization
 *         yearsOfExperience:
 *           type: number
 *           description: Number of years of experience
 *         certifications:
 *           type: array
 *           items:
 *             type: string
 *           description: List of lawyer's certifications
 *         qualification:
 *           type: string
 *           description: Lawyer's qualification (e.g. education degree)
 *         about:
 *           type: string
 *           description: Brief description about the lawyer
 *         image:
 *           type: string
 *           description: URL to lawyer's profile image
 *         isVerified:
 *           type: boolean
 *           description: Whether the lawyer is verified
 *         status:
 *           type: string
 *           enum: [online, offline]
 *           description: Lawyer's availability status
 *         price:
 *           type: number
 *           description: Consultation price
 *         totalConsults:
 *           type: number
 *           description: Total number of consultations
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

export default class LawyerController {
  /**
   * @swagger
   * /lawyers:
   *   post:
   *     summary: Create a new lawyer profile
   *     tags: [Lawyers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LawyerRequest'
   *     responses:
   *       201:
   *         description: Lawyer profile created successfully
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
   *                   example: Lawyer profile created successfully
   *                 data:
   *                   $ref: '#/components/schemas/LawyerResponse'
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
   *                   example: Lawyer already exists
   *       500:
   *         description: Server error
   */
  static async createLawyer(req: Request, res: Response) {
    try {
      const lawyer = new Lawyer(req.body);
      const existingLawyer = await Lawyer.findOne({
        userId: req.body.userId,
      });
      if (existingLawyer) {
        return res.status(400).json({
          status: "error",
          message: "Lawyer already exists",
        });
      }

      const savedLawyer = await lawyer.save();
      res.status(201).json({
        status: "success",
        message: "Lawyer profile created successfully",
        data: savedLawyer,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Error creating lawyer",
      });
    }
  }

  /**
   * @swagger
   * /lawyers:
   *   get:
   *     summary: Get all lawyers
   *     tags: [Lawyers]
   *     responses:
   *       200:
   *         description: List of lawyers retrieved successfully
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
   *                   example: Lawyers retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/LawyerResponse'
   *       500:
   *         description: Server error
   */
  static async getLawyers(req: Request, res: Response) {
    try {
      const lawyers = await Lawyer.find().populate({
        path: "userId",
        select: "fullName phone email dateOfBirth city gender",
      });
      res.status(200).json({
        status: "success",
        message: "Lawyers retrieved successfully",
        data: lawyers,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Error fetching lawyers",
      });
    }
  }

  /**
   * @swagger
   * /lawyers/{id}:
   *   get:
   *     summary: Get a lawyer by ID
   *     tags: [Lawyers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Lawyer ID
   *     responses:
   *       200:
   *         description: Lawyer retrieved successfully
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
   *                   example: Lawyer retrieved successfully
   *                 data:
   *                   $ref: '#/components/schemas/LawyerResponse'
   *       404:
   *         description: Lawyer not found
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
   *                   example: Lawyer not found
   *       500:
   *         description: Server error
   */
  static async getLawyer(req: Request, res: Response) {
    try {
      const lawyer = await Lawyer.findById(req.params.id).populate({
        path: "userId",
        select: "fullName phone email dateOfBirth city gender",
      });

      if (!lawyer) {
        return res.status(404).json({
          status: "error",
          message: "Lawyer not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Lawyer retrieved successfully",
        data: lawyer,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Error fetching lawyer",
      });
    }
  }

  /**
   * @swagger
   * /lawyers/{id}:
   *   put:
   *     summary: Update a lawyer profile
   *     tags: [Lawyers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Lawyer ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LawyerRequest'
   *     responses:
   *       200:
   *         description: Lawyer profile updated successfully
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
   *                   example: Lawyer profile updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/LawyerResponse'
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
   *                   example: Error updating lawyer
   *       404:
   *         description: Lawyer not found
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
   *                   example: Lawyer not found
   *       500:
   *         description: Server error
   */
  static async updateLawyer(req: Request, res: Response) {
    try {
      const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!lawyer) {
        return res.status(404).json({
          status: "error",
          message: "Lawyer not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Lawyer profile updated successfully",
        data: lawyer,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Error updating lawyer",
      });
    }
  }

  /**
   * @swagger
   * /lawyers/{id}/status:
   *   patch:
   *     summary: Toggle lawyer's status between online and offline
   *     tags: [Lawyers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Lawyer ID
   *     responses:
   *       200:
   *         description: Lawyer status toggled successfully
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
   *                   example: Lawyer status toggled successfully
   *                 data:
   *                   $ref: '#/components/schemas/LawyerResponse'
   *       404:
   *         description: Lawyer not found
   *       500:
   *         description: Server error
   */
  static async updateLawyerStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lawyer = await LawyerService.toggleLawyerStatus(id);

      if (!lawyer) {
        return res.status(404).json({
          status: "error",
          message: "Lawyer not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Lawyer status toggled successfully",
        data: lawyer,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error toggling lawyer status",
      });
    }
  }
}
