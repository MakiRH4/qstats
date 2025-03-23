import { QuTransaction } from "@/app/interface/interface.formdata";
import { validateHeaderValue } from "http";
import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "formdata.db");
export const db = new sqlite3.Database(
 dbPath,
 sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
 (err) => {
  if (err) {
   console.error(err.message);
  }
  console.log("Connected to the profile database.");
 }
);
// src/db.ts

// Crear las tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS qu_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      walletId TEXT NOT NULL,
      latestTick INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sourceId TEXT NOT NULL,
      destinationId TEXT NOT NULL,
      transactionHash TEXT NOT NULL,
      tick INTEGER NOT NULL,
      amount REAL NOT NULL,
      eventType INTEGER NOT NULL,
      createdAt DATETIME NOT NULL,
      walletId TEXT NOT NULL,
      FOREIGN KEY(walletId) REFERENCES qu_transactions(walletId)
    )
  `);
});

export default db;


export const handleNewEvents = (newData: QuTransaction): Promise<QuTransaction> => {
  return new Promise((resolve, reject) => {
    const { walletId, total, latestTick, events } = newData;
    const newEvents: Event[] = []; // Aquí almacenaremos los nuevos eventos

    // Primero verificamos si existe una transacción para el walletId
    db.get(`SELECT latestTick FROM qu_transactions WHERE walletId = ?`, [walletId], (err, row) => {
      if (err) {
        console.error('Error al obtener la transacción existente:', err);
        return reject('Error al obtener la transacción existente');
      }

      if (row) {
        // Si existe una transacción, comparamos el latestTick
        if (latestTick > row.latestTick) {
          // Actualizamos el latestTick
          db.run(`UPDATE qu_transactions SET latestTick = ? WHERE walletId = ?`, [latestTick, walletId], (err) => {
            if (err) {
              console.error('Error al actualizar el latestTick:', err);
              return reject('Error al actualizar el latestTick');
            }

            let eventsProcessed = 0;
            // Ahora verificamos cada evento para ver si es nuevo
            events.forEach((event) => {
              db.get(`SELECT tick FROM events WHERE walletId = ? AND tick = ?`, [walletId, event.tick], (err, existingEvent) => {
                if (err) {
                  console.error('Error al verificar si el evento ya existe:', err);
                  return reject('Error al verificar si el evento ya existe');
                }

                if (!existingEvent) {
                  // Si el evento no existe, lo insertamos y lo agregamos a la lista de nuevos eventos
                  db.run(`
                    INSERT INTO events (sourceId, destinationId, transactionHash, tick, amount, eventType, createdAt, walletId)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [event.sourceId, event.destinationId, event.transactionHash, event.tick, event.amount, event.eventType, event.createdAt, walletId],
                    (err) => {
                      if (err) {
                        console.error('Error al guardar el evento:', err);
                        return reject('Error al guardar el evento');
                      }
                      newEvents.push(event); // Agregamos el evento a la lista de nuevos eventos
                      eventsProcessed++;

                      // Verificamos si todos los eventos han sido procesados
                      if (eventsProcessed === events.length) {
                        resolve({ walletId, latestTick, total, events: newEvents }); // Solo devolvemos los nuevos eventos
                      }
                    });
                } else {
                  // Si el evento ya existe, solo incrementamos el contador de eventos procesados
                  eventsProcessed++;

                  // Verificamos si todos los eventos han sido procesados
                  if (eventsProcessed === events.length) {
                    resolve({ walletId, latestTick, total, events: newEvents }); // Solo devolvemos los nuevos eventos
                  }
                }
              });
            });
          });
        } else {
          // Si el latestTick no es mayor, no actualizamos, solo devolvemos la transacción sin nuevos eventos
          resolve({ walletId, latestTick: row.latestTick, total, events: [] });
        }
      } else {
        // Si no existe la transacción para el walletId, la creamos
        db.run(`INSERT INTO qu_transactions (walletId, latestTick) VALUES (?, ?)`, [walletId, latestTick], (err) => {
          if (err) {
            console.error('Error al crear la transacción:', err);
            return reject('Error al crear la transacción');
          }

          let eventsProcessed = 0;
          // Guardamos todos los eventos
          events.forEach((event) => {
            db.run(`
              INSERT INTO events (sourceId, destinationId, transactionHash, tick, amount, eventType, createdAt, walletId)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [event.sourceId, event.destinationId, event.transactionHash, event.tick, event.amount, event.eventType, event.createdAt, walletId],
              (err) => {
                if (err) {
                  console.error('Error al guardar el evento:', err);
                  return reject('Error al guardar el evento');
                }

                newEvents.push(event); // Agregamos el evento a la lista de nuevos eventos
                eventsProcessed++;

                // Verificamos si todos los eventos han sido procesados
                if (eventsProcessed === events.length) {
                  resolve({ walletId, latestTick, total, events: newEvents }); // Solo devolvemos los nuevos eventos
                }
              });
          });
        });
      }
    });
  });
};


  
export const find = async (query: string, value:string[]) => {
	return await new Promise((resolve, reject) => {
		db.all(query, value, (err, row) => {
			if (err) {
				console.log(err);
				return reject(err);
			}
			return resolve(row);
		});
	});
};

export const save = async (query: string, values: string[]) => {
return await new Promise((resolve, reject) => {
	db.run(query, values, function (err) {
		if (err) {
			console.log(err);
			reject(err);
		}
		resolve(null);
	});
});
};