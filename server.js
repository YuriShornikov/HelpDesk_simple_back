const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({ multipart: true }));

const tickets = [];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

app.use(async ctx => {
  // const { method } = ctx.request.querystring;
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      const { id } = ctx.request.query;
      const ticketById = tickets.find(ticket => ticket.id === id);
      if (ticketById) {
        ctx.response.body = ticketById;
      } else {
        ctx.response.status = 404;
      }
      return;

    // Создание тикета
    case 'createTicket':
      const { name, description, status } = ctx.request.body;
      const newTicket = {
        id: generateId(),
        name,
        description,
        status,
        created: new Date().getTime()
      };
      tickets.push(newTicket);
      console.log('Новый тикет:', newTicket);
      ctx.response.body = newTicket;
      return;
    
    // Обновление тикета
    case 'updateTicket':
      const { 
        id: updateId, 
        name: updateName, 
        description: updateDescription, 
        status: updateStatus 
      } = ctx.request.body;
      const ticketToUpdate = tickets.find(ticket => ticket.id === updateId);
      if (ticketToUpdate) {
        ticketToUpdate.name = updateName;
        ticketToUpdate.description = updateDescription;
        ticketToUpdate.status = updateStatus;
        ctx.response.body = ticketToUpdate;
      } else {
        ctx.response.status = 404;
      }
      return;

    // Удаление тикета
    case 'deleteTicket':
      const { id: deleteId } = ctx.request.body;
      const ticketToDelete = tickets.findIndex(ticket => ticket.id === deleteId);
      if (ticketToDelete !== -1) {
        const deletedTicket = tickets.splice(ticketIndexToDelete, 1)[0];
        ctx.response.body = deletedTicket;
      } else {
        ctx.response.status = 404;
      }
    default:
      ctx.response.status = 404;
      return;
    }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
