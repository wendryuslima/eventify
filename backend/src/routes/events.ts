import { Router } from 'express';
import { eventService } from '../services/event.service';
import { createEventSchema, updateEventSchema, eventParamsSchema } from '../schemas/event';
import { z } from 'zod';

const router = Router();

// Middleware de validação
const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Parâmetros inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// GET /api/events - Listar todos os eventos
router.get('/', async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    
    // Formatar resposta para incluir informações de vagas
    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      capacity: event.capacity,
      totalInscriptions: event._count.inscriptions,
      remainingCapacity: event.capacity - event._count.inscriptions,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    res.json({
      success: true,
      data: formattedEvents,
      total: formattedEvents.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/events/:id - Buscar evento por ID
router.get('/:id', validateParams(eventParamsSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      capacity: event.capacity,
      totalInscriptions: event._count.inscriptions,
      remainingCapacity: event.capacity - event._count.inscriptions,
      inscriptions: event.inscriptions,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };

    res.json({
      success: true,
      data: formattedEvent
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Evento não encontrado') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
});

// POST /api/events - Criar novo evento
router.post('/', validateBody(createEventSchema), async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      capacity: event.capacity,
      totalInscriptions: event._count.inscriptions,
      remainingCapacity: event.capacity - event._count.inscriptions,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      data: formattedEvent
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/events/:id - Atualizar evento
router.patch('/:id', 
  validateParams(eventParamsSchema),
  validateBody(updateEventSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await eventService.updateEvent(id, req.body);
      
      const formattedEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        status: event.status,
        capacity: event.capacity,
        totalInscriptions: event._count.inscriptions,
        remainingCapacity: event.capacity - event._count.inscriptions,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      };

      res.json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: formattedEvent
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Evento não encontrado') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message
        });
      }
      next(error);
    }
  }
);

// DELETE /api/events/:id - Deletar evento
router.delete('/:id', validateParams(eventParamsSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await eventService.deleteEvent(id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Evento não encontrado') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
});

export { router as eventRoutes };
