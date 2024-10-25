import TicketModel from '../dao/models/ticket.model.js';
import { generateUniqueCode } from '../utils/cartutil.js';

class TicketService {
    async createTicket(ticketData) {
        try {
            const code = generateUniqueCode();
            const newTicket = new TicketModel({
                code,
                amount: ticketData.amount,
                purchaser: ticketData.purchaser
            });
            await newTicket.save();
            return newTicket;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    async getTicketById(ticketId) {
        try {
            return await TicketModel.findById(ticketId);
        } catch (error) {
            console.error('Error getting ticket:', error);
            throw error;
        }
    }

    async getAllTickets() {
        try {
            return await TicketModel.find();
        } catch (error) {
            console.error('Error getting all tickets:', error);
            throw error;
        }
    }
}

export default new TicketService();
