import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../interfaces/auth.interface";
import ReviewService from "../services/review.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - lawyerId
 *         - rating
 *         - date
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the review
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
 *           description: User data of the reviewer
 *         lawyerId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The lawyer's ID
 *             userId:
 *               type: string
 *               description: The lawyer's user ID
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
 *             user:
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
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given to the lawyer (1-5)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the review
 *         comment:
 *           type: string
 *           description: Review comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was last updated
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Review created successfully
 *         data:
 *           $ref: '#/components/schemas/Review'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Review not found
 */

export default class ReviewController {
  /**
   * @swagger
   * /reviews:
   *   post:
   *     summary: Create a new review
   *     tags: [Reviews]
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
   *               - rating
   *               - date
   *               - comment
   *             properties:
   *               lawyerId:
   *                 type: string
   *                 example: "60d21b4667d0d8992e610c85"
   *               rating:
   *                 type: number
   *                 minimum: 1
   *                 maximum: 5
   *                 example: 5
   *               date:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-03-20T10:00:00Z"
   *               comment:
   *                 type: string
   *                 example: "Great service and very professional"
   *     responses:
   *       201:
   *         description: Review created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReviewResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   */
  static async createReview(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const reviewData = {
        ...req.body,
        userId: req.user._id.toString(),
      };

      const review = await ReviewService.createReview(reviewData);
      res.status(201).json({
        status: "success",
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reviews:
   *   get:
   *     summary: Get all reviews
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: lawyerId
   *         schema:
   *           type: string
   *         description: Filter reviews by lawyer ID
   *     responses:
   *       200:
   *         description: List of reviews
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
   *                   example: Reviews retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Review'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getReviews(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const lawyerId = req.query.lawyerId;
      let reviews;

      if (lawyerId) {
        reviews = await ReviewService.getReviewsByLawyerId(lawyerId);
      } else {
        reviews = await ReviewService.getReviews();
      }

      res.status(200).json({
        status: "success",
        message: "Reviews retrieved successfully",
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reviews/{id}:
   *   get:
   *     summary: Get a review by ID
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Review ID
   *     responses:
   *       200:
   *         description: Review found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReviewResponse'
   *       404:
   *         description: Review not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   */
  static async getReviewById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const reviewId = req.params.id;
      if (!reviewId) {
        return res.status(400).json({
          status: "error",
          message: "Review ID is required",
        });
      }

      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({
          status: "error",
          message: "Review not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Review retrieved successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reviews/{id}:
   *   delete:
   *     summary: Delete a review
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Review ID
   *     responses:
   *       200:
   *         description: Review deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReviewResponse'
   *       404:
   *         description: Review not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - User can only delete their own reviews
   */
  static async deleteReview(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const reviewId = req.params.id;
      if (!reviewId) {
        return res.status(400).json({
          status: "error",
          message: "Review ID is required",
        });
      }

      const review = await ReviewService.getReviewById(reviewId);
      if (!review) {
        return res.status(404).json({
          status: "error",
          message: "Review not found",
        });
      }

      // Check if the user is the owner of the review
      if (review.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden - You can only delete your own reviews",
        });
      }

      const deletedReview = await ReviewService.deleteReview(reviewId);
      res.status(200).json({
        status: "success",
        message: "Review deleted successfully",
        data: deletedReview,
      });
    } catch (error) {
      next(error);
    }
  }
}
