import { Router } from 'express';
import { eventService } from '../services/event.service';
import { 
  createInscriptionSchema, 
  cancelInscriptionSchema, 
  inscriptionParamsSchema 
} from '../schemas/inscription';
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

// POST /api/events/:id/inscriptions - Inscrever participante
router.post('/:id/inscriptions', 
  validateParams(inscriptionParamsSchema),
  validateBody(createInscriptionSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const inscription = await eventService.createInscription(id, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Inscrição realizada com sucesso!',
        data: {
          id: inscription.id,
          name: inscription.name,
          phone: inscription.phone,
          eventId: inscription.eventId,
          eventTitle: inscription.event.title,
          createdAt: inscription.createdAt
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        
        if (message === 'Evento não encontrado') {
          return res.status(404).json({
            error: 'Not Found',
            message: message
          });
        }
        
        if (message === 'Evento não está ativo para inscrições') {
          return res.status(400).json({
            error: 'Bad Request',
            message: message
          });
        }
        
        if (message === 'Evento esgotado - não há mais vagas disponíveis') {
          return res.status(409).json({
            error: 'Conflict',
            message: message
          });
        }
        
        if (message === 'Você já está inscrito neste evento') {
          return res.status(409).json({
            error: 'Conflict',
            message: message
          });
        }
      }
      next(error);
    }
  }
);

// DELETE /api/events/:id/inscriptions - Cancelar inscrição
router.delete('/:id/inscriptions', 
  validateParams(inscriptionParamsSchema),
  validateBody(cancelInscriptionSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { phone } = req.body;
      
      const result = await eventService.cancelInscription(id, phone);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        
        if (message === 'Inscrição não encontrada') {
          return res.status(404).json({
            error: 'Not Found',
            message: message
          });
        }
      }
      next(error);
    }
  }
);

// GET /api/events/:id/inscriptions - Listar inscrições do evento
router.get('/:id/inscriptions', 
  validateParams(inscriptionParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await eventService.getEventInscriptions(id);
      
      res.json({
        success: true,
        data: result
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

export { router as inscriptionRoutes };
