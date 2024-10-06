const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const figlet = require('figlet');
const gradient = require('gradient-string').default; 
const readline = require('readline');
const log = require('node-color-log');
const fs = require('fs');
const tagline = "[SeekCat] $ "
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let clients = [];
let activeBots = [];
let unactiveBots = [];

function setBashTitle(title) {
    process.stdout.write(`\x1b]0;${title}\x07`);
}

setBashTitle("Seek Raid / Tokens -")

function MainMenu() {
    console.clear()
    log.info(`
                $$$$$$\\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
               1. SingleBot         2. MultiBot [Require bottoken.txt]
               3. Exit
    `);
    rl.question(tagline + 'Options: ', (choice) => {
        switch (choice.trim()) {
            case '1':
                promptForToken();
                break;
            case '2':
                loginMultiBots();
                break;
            case '3':
                rl.close(); // Close the readline interface
                break;
            default:
                console.log('Invalid option. Please select 1, 2, or 3.');
                MainMenu();
        }
    });
}

function promptForToken() {
    rl.question(tagline + 'Discord token: ', (token) => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
            ],
        });
        client.login(token)
            .then(() => {
                client.once('ready', () => {
                    console.clear();
                    log.debug(tagline + 'Bot is ready!' + client.user.tag);
                    activeBots.push(token.trim());
                    clients.push(client);
                    showMainMenu();
                });
            })
            .catch(err => {
                console.clear();
                log.error(tagline + 'Invalid Token. Please try again.', err);
                MainMenu();
            });
    });
}

async function loginMultiBots() {
    log.debug(tagline + "Seek Cat current working in please wait nigga :3.");
    const valuetoken = fs.readFileSync('bottoken.txt', 'utf-8')
        .split("\n")
        .map(token => token.trim())
        .filter(Boolean);

    const loginPromises = valuetoken.map((token) => {
        return new Promise((resolve, reject) => {
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.MessageContent,
                ],
            });
            client.login(token)
                .then(() => {
                    client.once('ready', () => {
                        log.success(tagline + `Success Login ${client.user.tag}`);
                        activeBots.push(token.trim());
                        clients.push(client); // Store the client instance
                        resolve();
        		setBashTitle(`Seek Raid / Tokens ${activeBots.length}`);
                    });
                })
                .catch(err => {
                    log.error(tagline + `Failed Login ${token.trim()}: ${err.message}`);
                    unactiveBots.push(token.trim());
                    reject(err);
                });
        });
    });

    try {
        await Promise.all(loginPromises);
        log.info(tagline + 'All bots have attempted to login.');
        setBashTitle(`Seek Raid / Tokens ${activeBots.length}`);
        console.clear();
        showMainMenu(activeBots.length);
    } catch (err) {
	console.log(err)
	MainMenu()
        log.error('Some bots failed to login.');
    }
}
function truncateString(str, length) {
    if (typeof str !== 'string') return str || '';
    return str.length > length ? str.slice(0, length - 3) + '...' : str;
}

async function showStatus(Active) {
    let animationInterval;

    async function getOwnerName(bot) {
        try {
            const ownerId = bot.user.ownerId;
            if (!ownerId) return 'Unknown Owner';

            // Lấy thông tin người dùng
            const owner = await bot.client.users.fetch(ownerId);
            return owner.tag;
        } catch (error) {
            console.error('Error fetching owner:', error);
            return 'Unknown Owner';
        }
    }

    figlet('SeekCat', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }

        // Center the text
        const terminalWidth = process.stdout.columns; // Get the terminal width
        const textLines = data.split('\n'); // Split the text into lines
        const centeredLines = textLines.map(line => {
            const padding = Math.max(0, Math.floor((terminalWidth - line.length) / 2)); 
            return ' '.repeat(padding) + line;
        });

        // Prepare the gradient animation
        const frames = [
            gradient(['black', 'gray', 'white'])(centeredLines.join('\n')),   // Frame 1
            gradient(['white', 'black', 'gray'])(centeredLines.join('\n')),   // Frame 2
            gradient(['gray', 'white', 'black'])(centeredLines.join('\n'))    // Frame 3
        ];

        let index = 0; // Định nghĩa biến index để điều khiển hiệu ứng động
        animationInterval = setInterval(() => {
            console.clear();
            console.log(frames[index % frames.length]);  // Display the gradient text
Run()
            index++;
        }, 500); // Thay đổi tốc độ hiển thị nếu cần

        console.log('\nPress Enter to continue.');
    });

    async function Run() {
        console.log("  ╔═══════════════╗═════════════════════════════════════════╗");
        console.log("  ║     Status    ║                 Bot Status              ║");

        const botNameWidth = 15;
        const statusWidth = 30;
        const ownerNameWidth = 30; 

        if (activeBots.length > 0) {
            const ownerNames = await Promise.all(clients.map(bot => getOwnerName(bot)));
            
            clients.forEach((bot, index) => {
                const botName = truncateString(bot.user.tag, botNameWidth).padEnd(botNameWidth);
                const serversCount = bot.guilds.cache.size;
                const ownerName = truncateString(ownerNames[index], ownerNameWidth).padEnd(ownerNameWidth);
                console.log(`  ║${botName}║  OK / ${serversCount} / ${ownerName}║`);
            });
        } else {
            console.log(`  ║Name Bot${' '.repeat(botNameWidth - 10)}║  OK / 0 / Owner Bot Name             ║`);
        }
    console.log("  ╚═══════════════╝═════════════════════════════════════════╝");
    }

    rl.on('line', () => {
        clearInterval(animationInterval);  // Stop animation when Enter is pressed
        console.clear();
        showMainMenu(Active);
    });

}

function showMainMenu(Active) {
    function Menu(Active) {
    console.clear();
    log.info(`
                $$$$$$\\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
               1. Spammer         2. Delete         3. Create         4. Edit
               5. Status            6. Exit
    `);

    rl.question(tagline + `Options: `, (answer) => {
        switch (answer.trim()) {
            case `1`:
                console.clear();
                showSpammerMenu(Active);
                break;
            case `2`:
                console.clear();
                showDeleteMenu(Active);
                break;
            case `3`:
                console.clear();
                showCreateMenu(Active);
                break;
            case `4`:
                console.clear();
                showEditMenu(Active);
                break;
            case `5`:
                console.clear();
                showStatus(Active)
                break;
            case `6`:
                rl.close(); // Close the readline interface
                break;
            default:
                log.error(`Invalid option, try again.`);
                console.clear();
                showMainMenu(Active);
        }
    });
    }
    if (!Active) {
         Menu(1)
    } else {
         Menu(Active)
    }
}

// Spammer
function showSpammerMenu(Active) {
    console.clear();
    log.info(`
                $$$$$$\\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
                1. Dm         2. Chat
    `);
    rl.question(tagline + `Option: `, (answer) => {
        switch (answer.trim()) {
            case `1`:
                askDmDetails(Active);
                break;
            case `2`:
                askChatDetails(Active);
                break;
            default:
                log.error(`Invalid option, try again.`);
                showSpammerMenu();
        }
    });
}
// Delete
function showDeleteMenu(Active) {
    console.clear();
    log.info(`
                $$$$$$\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
                1.Role         2.Channel         3.Message
    `);
    rl.question(tagline + `Options: ` , (answer) => {
        switch (answer.trim()) {
            case `1`:
                deleteAllRoles(Active);
                break;
            case `2`:
                deleteAllChannels(Active);
                break;
            case `3`:
                deleteAllMessages(Active);
                break;
            default:
                log.error(tagline + `Invalid option, try again.`);
                console.clear();
                showDeleteMenu(Active);
        }
    });
}
// Create
function showCreateMenu(Active) {
    console.clear();
    log.info(`
                $$$$$$\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
                1.Role         2.Channel         3.Message
    `);
    rl.question(tagline + `Options: ` , (answer) => {
        switch (answer.trim()) {
            case `1`:
                createRole(Active);
                break;
            case `2`:
                createChannel(Active);
                break;
            case `3`:
                createMessage(Active);
                break;
            default:
                log.error(tagline + `Invalid option, try again.`);
                console.clear();
                showCreateMenu(Active);
        }
    });
}
// Edit
function showEditMenu(Active) {
    console.clear();
    log.info(`
                $$$$$$\                      $$\\        $$$$$$\\             $$\\     
               $$  __$$\\                     $$ |      $$  __$$\\            $$ |    
               $$ /  \\__| $$$$$$\\   $$$$$$\\  $$ |  $$\\ $$ /  \\__| $$$$$$\\ $$$$$$\\   
               \\$$$$$$\\  $$  __$$\\ $$  __$$\\ $$ | $$  |$$ |       \\____$$\\\\_$$  _|  
                \\____$$\\ $$$$$$$$ |$$$$$$$$ |$$$$$$  / $$ |       $$$$$$$ | $$ |    
               $$\\   $$ |$$   ____|$$   ____|$$  _$$<  $$ |  $$\\ $$  __$$ | $$ |$$\\ 
               \\$$$$$$  |\\$$$$$$$\\ \\$$$$$$$\\ $$ | \\$$\\ \\$$$$$$  |\\$$$$$$$ | \\$$$$  |
                \\______/  \\_______| \\_______|\\__|  \\__| \\______/  \\_______|  \\____/ 
                                                                  
                                         [A happy Cat]
                1.Role         2.Channel         3.Server
    `);
    rl.question(tagline + `Options: ` , (answer) => {
        switch (answer.trim()) {
            case `1`:
                editRole(Active);
                break;
            case `2`:
                editChannel(Active);
                break;
            case `3`:
                editServerName(Active);
                break;
            default:
                log.error(`Invalid option, try again.`);
                showEditMenu(Active);
        }
    });
}
// Spammer Function
function askDmDetails(Active) {
    rl.question(tagline + `User id: `, (userId) => {
        rl.question(tagline + `Amount: `, (amount) => {
            rl.question(tagline + `Enter Message: `, (message) => {
                console.clear();
                sendDm(Active, userId, amount, message);
            });
        });
    });
}

function askChatDetails(Active) {
    rl.question(tagline + `Channel id: `, (channelId) => {
        rl.question(tagline + `Amount: `, (amount) => {
            rl.question(tagline + `Enter Message: `, (message) => {
                console.clear();
                sendChat(Active, channelId, amount, message);
            });
        });
    });
}

function sendDm(Active, userId, amount, message) {
    if (1 < Active) { 
        log.warn(`If you have to much bot [${Active}], i care you must set low amount its will be ${amount} to be ${amount * Active}`) 
        Run()
    } else {
        Run()
    }
    async function Run() {
    clients.forEach(client => {
        client.users.fetch(userId).then(user => {
            let count = 0;
            const interval = setInterval(() => {
                if (count < amount) {
                    user.send(`${message}`)
                        .then(() => {
                            log.success(`Sent DM to ${user.tag}: ${message}`);
                        })
                        .catch(err => {
                            log.error(`Failed to send DM to ${user.tag}: ${err.message}`);
                        });
                    count++;
                } else {
                    clearInterval(interval);
		    showMainMenu(Active)
                }
            }, 1000);
        }).catch(err => {
            log.error(`Failed to fetch user ${userId}: ${err.message}`);
        });
    });
    }
}

function sendChat(Active, channelId, amount, message) {
    if (1 < Active) { 
        log.warn(`If you have to much bot [${Active}], i care you must set low amount its will be ${amount} to be ${amount * Active}`) 
        Run()
    } else {
        Run()
    }
    async function Run() {
    clients.forEach(client => {
        client.channels.fetch(channelId).then(channel => {
            let count = 0;
            const interval = setInterval(() => {
                if (count < amount) {
                    channel.send(`${message}`)
                        .then(() => {
                            log.success(`Sent chat message: ${message}`);
                        })
                        .catch(err => {
                            log.error(`Failed to send chat message: ${err.message}`);
                        });
                    count++;
                } else {
                    clearInterval(interval);
		    showMainMenu(Active)
                }
            }, 1000);
        }).catch(err => {
            log.error(`Failed to fetch channel ${channelId}: ${err.message}`);
        });
    });
    }
}
// Delete Function
function deleteAllRoles(Active) {
    rl.question(tagline + `Server id: `, (serverId) => {
        if (1 < Active) { 
            log.warn(`You have to much bot [${Active}], maybe some bot delete same Role or HIgh Role Cannot Delete becareful :3.`) 
            Run()
        } else {
            Run()
        }
        async function Run() {
            clients.forEach(client => {
                const guild = client.guilds.cache.get(serverId);
                if (guild) {
                    let roles = guild.roles.cache.filter(role => !role.managed && role.editable);
                    let count = 0;
                    const interval = setInterval(() => {
                        if (count < roles.size) {
                            const role = roles.at(count);
                            role.delete().then(() => log.info(tagline + `Deleted role: ${role.name}`));
                            count++;
                        } else {
                            clearInterval(interval);
                            log.success(tagline + `All roles deleted!`);
                            console.clear();
                            showMainMenu(Active);
                        }
                    }, 1);
                } else {
                    log.error(tagline + `Guild not found!`);
                    console.clear();
                    showMainMenu(Active);
                }
            })
        }
    });
}

function deleteAllChannels(Active) {
    rl.question(tagline + `Server id:` , (serverId) => {
        if (1 < Active) { 
            log.warn(`You have to much bot [${Active}], maybe some bot delete same Channel becareful :3.`) 
            Run()
        } else {
            Run()
        }
        async function Run() {
            clients.forEach(client => {
                const guild = client.guilds.cache.get(serverId);
                if (guild) {
                    let channels = guild.channels.cache;
                    let count = 0;
                    const interval = setInterval(() => {
                        if (count < channels.size) {
                            const channel = channels.at(count);
                            channel.delete().then(() => log.info(tagline + `Deleted channel: ${channel.name}`));
                            count++;
                        } else {
                            clearInterval(interval);
                            log.success(tagline + `All Channel was delte Success`);
                            console.clear();
                            showMainMenu(Active);
                        }
                    }, 1);
                } else {
                    log.error(tagline + `Guild not found!`);
                    console.clear();
                    showMainMenu(Active);
                }
            })
        }
    });
}

function deleteAllMessages(Active) {
    rl.question(tagline + `Channel id: `, (channelId) => {
        if (1 < Active) { 
            log.warn(`You have to much bot [${Active}], maybe some bot delete same message becareful :3.`) 
            Run()
        } else {
            Run()
        }
        async function Run() {
            clients.forEach(client => {
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    channel.messages.fetch().then(messages => {
                        let count = 0;
                        const interval = setInterval(() => {
                            if (count < messages.size) {
                                const message = messages.at(count);
                                message.delete();
                                count++;
                            } else {
                                clearInterval(interval);
                                log.success(tagline + `All messages deleted!`);
                                console.clear();
                                showMainMenu();
                            }
                        }, 1);
                    }).catch(err => {
                        log.error(tagline + `Failed to fetch messages:`, err);
                        console.clear();
                        showMainMenu(Active);
                    });
                } else {
                    log.error(tagline + `Channel not found!`);
                    console.clear();
                    showMainMenu(Active);
                }
            })
        }
    });
}
// Create Function
function createRole(Active) {
    rl.question(tagline + `Server id:` , (serverId) => {
        rl.question(tagline + `Role Name:` , (roleName) => {
            rl.question(tagline + `Annoment:` , (annoment) => {
                clients.forEach(client => {
                    const guild = client.guilds.cache.get(serverId);
                    if (guild) {
                        let count = 0;
                        const interval = setInterval(() => {
                            if (count < annoment) {
                                guild.roles.create({ name: `${roleName}`})
                                    .then(() => log.success(tagline + `Role "${roleName} ${count + 1}" created!`))
                                    .catch(err => log.error(tagline + `Failed to create role:`, err));
                                count++;
                            } else {
                                clearInterval(interval);
                                console.clear();
                                showMainMenu(Active);
                            }
                        }, 1);
                    } else {
                        log.error(tagline + `Guild not found!`);
                        console.clear();
                        showMainMenu(Active);
                    }
                })
            });
        });
    });
}

function createChannel(Active) {
    rl.question(tagline + `Server id:` , (serverId) => {
        rl.question(tagline + `Channel Name:` , (channelName) => {
            rl.question(tagline + `Annoment:` , (annoment) => {
                clients.forEach(client => {
                    const guild = client.guilds.cache.get(serverId);
                    if (guild) {
                        let count = 0;
                        const interval = setInterval(() => {
                            if (count < annoment) {
                                guild.channels.create({
      				     name: channelName,
    			 	     type: ChannelType.GuildText,
				})
                                    .then(() => log.success(tagline + `[${count + 1}]: Channel "${channelName} ${count + 1}" created!`))
                                    .catch(err => {
					log.error(tagline + `[${count + 1}]: Failed to create channel:`, err);
                        		console.clear();
                        		showMainMenu(Active);
				    })
                                count++
                            } else {
                                clearInterval(interval);
                                console.clear();
                                showMainMenu(Active);
                            }
                        }, 1);
                    } else {
                        log.error(tagline + `Guild not found!`);
                        console.clear();
                        showMainMenu(Active);
                    }
                })
            });
        });
    });
}

function createMessage(Active) {
    rl.question(tagline + `Channel id:` , (channelId) => {
        rl.question(tagline + `Message:` , (message) => {
            rl.question(tagline + `Annoment:` , (annoment) => {
            if (1 < Active) { 
                log.warn(`If you have to much bot [${Active}], i care you must set low amount its will be ${amount} to be ${amount * Active}`) 
                Run()
            } else {
                Run()
            }
                clients.forEach(client => {
                    const channel = client.channels.cache.get(channelId);
                    if (channel) {
                        let count = 0;
                        const interval = setInterval(() => {
                            if (count < annoment) {
                                channel.send(message)
                                    .then(() => log.success(tagline + `[${count + 1}]: Message sent successfully!`))
                                    .catch(err => log.error(tagline + `[${count + 1}]: Failed to send message:`, err));
                                count++;
                            } else {
                                clearInterval(interval);
                                console.clear();
                                showMainMenu(Active);
                            }
                        }, 1);
                    } else {
                        log.error(tagline + `Channel not found!`);
                        console.clear();
                        showMainMenu(Active);
                    }
                })
            });
        });
    });
}
MainMenu();
