#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const schemas_1 = require("./schemas");
const web_server_1 = require("./web-server");
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
const tools = [];
const handlers = new Map();
const schemas = new Map();
function registerTool(name, description, schema, handler) {
    const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema);
    const tool = {
        name,
        description,
        inputSchema: jsonSchema,
    };
    tools.push(tool);
    handlers.set(name, handler);
    schemas.set(name, schema);
}
async function executeHandler(name, args) {
    const handler = handlers.get(name);
    const schema = schemas.get(name);
    if (!handler || !schema) {
        throw new Error(`Unknown tool: ${name}`);
    }
    const validatedArgs = schema.parse(args);
    return handler(validatedArgs);
}
const server = new index_js_1.Server({
    name: "basic-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
const TOOLS = {
    ECHO: "echo",
    ADD_NUMBERS: "add_numbers",
    GET_SYSTEM_INFO: "get_system_info",
    CREATE_USER: "create_user",
    GET_USERS: "get_users",
    GET_USER: "get_user",
    UPDATE_USER: "update_user",
    DELETE_USER: "delete_user",
    GET_EXERCISES: "get_exercises",
    GET_EXERCISE: "get_exercise",
    CREATE_EXERCISE: "create_exercise",
    UPDATE_EXERCISE: "update_exercise",
    DELETE_EXERCISE: "delete_exercise",
    GET_INGREDIENTS: "get_ingredients",
    GET_INGREDIENT: "get_ingredient",
    CREATE_INGREDIENT: "create_ingredient",
    UPDATE_INGREDIENT: "update_ingredient",
    DELETE_INGREDIENT: "delete_ingredient",
    GET_MEALS: "get_meals",
    GET_MEAL: "get_meal",
    CREATE_MEAL: "create_meal",
    UPDATE_MEAL: "update_meal",
    DELETE_MEAL: "delete_meal",
    GET_MEAL_DAYS: "get_meal_days",
    GET_MEAL_DAY: "get_meal_day",
    CREATE_MEAL_DAY: "create_meal_day",
    UPDATE_MEAL_DAY: "update_meal_day",
    DELETE_MEAL_DAY: "delete_meal_day",
    GET_SETS: "get_sets",
    GET_SET: "get_set",
    CREATE_SET: "create_set",
    UPDATE_SET: "update_set",
    DELETE_SET: "delete_set",
    GET_WORKOUTS: "get_workouts",
    GET_WORKOUT: "get_workout",
    CREATE_WORKOUT: "create_workout",
    UPDATE_WORKOUT: "update_workout",
    DELETE_WORKOUT: "delete_workout",
};
registerTool(TOOLS.CREATE_USER, "Create a new user in the API (name, email, password)", schemas_1.CreateUserSchema, async ({ name, email, password }) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating user: ${error.error || response.statusText}`,
                },
            ],
        };
    }
    const user = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `User created: ${user.name} (${user.email}) [id: ${user.id}]`,
            },
        ],
    };
});
registerTool(TOOLS.GET_USERS, "Get a list of all users from the API", schemas_1.GetUsersSchema, async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching users: ${response.statusText}`,
                },
            ],
        };
    }
    const users = await response.json();
    return {
        content: [
            { type: "text", text: `Users: ${JSON.stringify(users, null, 2)}` },
        ],
    };
});
registerTool(TOOLS.GET_USER, "Get a user by ID from the API", schemas_1.GetUserSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
    if (!response.ok) {
        return {
            content: [
                { type: "text", text: `Error fetching user: ${response.statusText}` },
            ],
        };
    }
    const user = await response.json();
    return {
        content: [
            { type: "text", text: `User: ${JSON.stringify(user, null, 2)}` },
        ],
    };
});
registerTool(TOOLS.UPDATE_USER, "Update a user by ID in the API (any of name, email, password)", schemas_1.UpdateUserSchema, async ({ id, ...rest }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
            content: [
                {
                    type: "text",
                    text: `Error updating user: ${error.error || response.statusText}`,
                },
            ],
        };
    }
    const user = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `User updated: ${JSON.stringify(user, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_USER, "Delete a user by ID in the API", schemas_1.DeleteUserSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        return {
            content: [
                { type: "text", text: `Error deleting user: ${response.statusText}` },
            ],
        };
    }
    return {
        content: [{ type: "text", text: `User deleted: ${id}` }],
    };
});
// --- EXERCISE TOOLS ---
registerTool(TOOLS.GET_EXERCISES, "Get all exercises (optionally filter by workout_id)", schemas_1.ExerciseQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/exercises${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_EXERCISE, "Get an exercise by id", schemas_1.ExerciseIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/exercises/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_EXERCISE, "Create a new exercise", schemas_1.CreateExerciseSchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Exercise created: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.UPDATE_EXERCISE, "Update an exercise by id", schemas_1.UpdateExerciseSchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/exercises/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Exercise updated: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_EXERCISE, "Delete an exercise by id", schemas_1.ExerciseIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/exercises/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `Exercise deleted: ${id}` }] };
});
// --- INGREDIENT TOOLS ---
registerTool(TOOLS.GET_INGREDIENTS, "Get all ingredients (optionally filter by meal_id)", schemas_1.IngredientQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/ingredients${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_INGREDIENT, "Get an ingredient by id", schemas_1.IngredientIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/ingredients/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_INGREDIENT, "Create a new ingredient", schemas_1.CreateIngredientSchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Ingredient created: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.UPDATE_INGREDIENT, "Update an ingredient by id", schemas_1.UpdateIngredientSchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Ingredient updated: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_INGREDIENT, "Delete an ingredient by id", schemas_1.IngredientIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/ingredients/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `Ingredient deleted: ${id}` }] };
});
// --- MEAL TOOLS ---
registerTool(TOOLS.GET_MEALS, "Get all meals (optionally filter by user_id)", schemas_1.MealQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/meals${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_MEAL, "Get a meal by id", schemas_1.MealIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/meals/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_MEAL, "Create a new meal", schemas_1.CreateMealSchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Meal created: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.UPDATE_MEAL, "Update a meal by id", schemas_1.UpdateMealSchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Meal updated: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_MEAL, "Delete a meal by id", schemas_1.MealIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/meals/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `Meal deleted: ${id}` }] };
});
// --- MEALDAY TOOLS ---
registerTool(TOOLS.GET_MEAL_DAYS, "Get all meal days (optionally filter by meal_id or day_of_week)", schemas_1.MealDayQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/meal-days${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_MEAL_DAY, "Get a meal day by id", schemas_1.MealDayIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/meal-days/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_MEAL_DAY, "Create a new meal day", schemas_1.CreateMealDaySchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/meal-days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `MealDay created: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.UPDATE_MEAL_DAY, "Update a meal day by id", schemas_1.UpdateMealDaySchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/meal-days/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `MealDay updated: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_MEAL_DAY, "Delete a meal day by id", schemas_1.MealDayIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/meal-days/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `MealDay deleted: ${id}` }] };
});
// --- SET TOOLS ---
registerTool(TOOLS.GET_SETS, "Get all sets (optionally filter by exercise_id)", schemas_1.SetQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/sets${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_SET, "Get a set by id", schemas_1.SetIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/sets/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_SET, "Create a new set", schemas_1.CreateSetSchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            { type: "text", text: `Set created: ${JSON.stringify(data, null, 2)}` },
        ],
    };
});
registerTool(TOOLS.UPDATE_SET, "Update a set by id", schemas_1.UpdateSetSchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/sets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            { type: "text", text: `Set updated: ${JSON.stringify(data, null, 2)}` },
        ],
    };
});
registerTool(TOOLS.DELETE_SET, "Delete a set by id", schemas_1.SetIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/sets/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `Set deleted: ${id}` }] };
});
// --- WORKOUT TOOLS ---
// Eliminar declaraciones locales duplicadas de esquemas de workout
registerTool(TOOLS.GET_WORKOUTS, "Get all workouts (optionally filter by user_id)", schemas_1.WorkoutQuerySchema, async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${API_BASE_URL}/api/workouts${params ? `?${params}` : ""}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.GET_WORKOUT, "Get a workout by id", schemas_1.WorkoutIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/${id}`);
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
registerTool(TOOLS.CREATE_WORKOUT, "Create a new workout", schemas_1.CreateWorkoutSchema, async (body) => {
    const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Workout created: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.UPDATE_WORKOUT, "Update a workout by id", schemas_1.UpdateWorkoutSchema, async ({ id, ...body }) => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    const data = await response.json();
    return {
        content: [
            {
                type: "text",
                text: `Workout updated: ${JSON.stringify(data, null, 2)}`,
            },
        ],
    };
});
registerTool(TOOLS.DELETE_WORKOUT, "Delete a workout by id", schemas_1.WorkoutIdSchema, async ({ id }) => {
    const response = await fetch(`${API_BASE_URL}/api/workouts/${id}`, {
        method: "DELETE",
    });
    if (!response.ok)
        return {
            content: [{ type: "text", text: `Error: ${response.statusText}` }],
        };
    return { content: [{ type: "text", text: `Workout deleted: ${id}` }] };
});
// Configurar manejadores del servidor
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools,
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return executeHandler(name, args);
});
async function main() {
    const args = process.argv.slice(2);
    const mode = args.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "stdio";
    if (mode === "http") {
        const port = parseInt(process.env.PORT || "3002");
        const app = await (0, web_server_1.createHttpServer)(port, tools, handlers, schemas, executeHandler);
        try {
            await app.listen({ port, host: "0.0.0.0" });
            console.log(`HTTP MCP Server started on port ${port}`);
        }
        catch (err) {
            console.error("Error starting HTTP server:", err);
            process.exit(1);
        }
    }
    else {
        // Modo stdio (default)
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        console.error("MCP Server started successfully in stdio mode");
    }
}
// Manejo de errores y señales
process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
});
// Iniciar el servidor
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
