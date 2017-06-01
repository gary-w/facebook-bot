# Facebook-Bot

This is a To-list Facebook Chatbot helping you keep track of your busy lives. 

## User Commands

Type the following commands to interact with your very own To-do List chatbot!

- LIST: Shows a list of your current to-do items
- {#itemNumber} DONE: Marks that particular item as complete
- {#itemNumber} DELETE: Deletes that particular item from your list
- ADD {itemString}: Adds your chosen item to the to-do list
- SMASHED IT: Marks your whole list as complete


## Sample Interaction

**USER:** ADD Workout at the gym  
**BOT:** Your to-do item 'Workout at the gym' has been added!  
**USER:** ADD Take medicine  
**BOT:** Your to-do item 'Take medicine' has been added!  
**USER:** ADD Test out this awesome chatbot  
**BOT:** Your to-do item 'Test out this awesome chatbot' has been added!  
**USER:** ADD Drink lots of water  
**BOT:** Your to-do item 'Drink lots of water' has been added!


**USER:** LIST
**BOT:** Workout at the gym
**BOT:** Take medicine
**BOT:** Test out this awesome chatbot
**BOT:** Drink lots of water


**USER:** #1 DONE
**BOT:** Your to-do item 'Workout at the gym' has been marked as done!
**USER:** #2 DELETE
**BOT:** Your to-do item 'Take medicine' has been deleted!
**USER:** LIST
**BOT:** Test out this awesome chatbot
**BOT:** Drink lots of water

**USER:** SMASHED IT
**BOT:** Congratulations, all your to-do items are complete!
