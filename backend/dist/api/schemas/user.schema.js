"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserParamsSchema = exports.UserResponseSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    email: zod_1.z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be less than 255 characters')
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters').optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be less than 255 characters').optional()
});
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    created_at: zod_1.z.date()
});
exports.UserParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().positive('User ID must be a positive number')
});
//# sourceMappingURL=user.schema.js.map