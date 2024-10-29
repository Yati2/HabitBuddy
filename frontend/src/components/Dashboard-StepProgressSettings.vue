<template>
    <form> <!--//not sure if form is needed??-->
        <label for="streakGoal">Streak Goal: &nbsp </label>
        <input type="text" id="streakGoal" name="streakGoal">
        <!-- <select name="streakGoal" id="streakGoal">
            <option> </option>
        </select> -->
        <div >Streak Checkpoints/intervals</div>
        <select name="streakCheckpoint" id="streakCheckpoint">
            <option value="7days">Daily</option>
            <option value="bypercent">by percent
                <select name="bypercentcustomisation" id="bypercentcustomisation">
                    <option value="7days">Daily</option>
                    <option value="7days">Daily</option>
                </select>
            </option>
        </select>
    </form>
</template>

<style scoped>
    /* props: {
      streakGoal: {
        type: Number,
        required: true,
      },
      currentStep: {
        type: Number,
        required: true,
        default: 0,
      },
    }, */
</style>