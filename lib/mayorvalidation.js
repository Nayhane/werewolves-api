module.exports = (player) =>{

}



const wakkerdamArray =  this.props.players.filter((player) => {
   return player.village[0].name === "Wakkerdam"
 })

 const sluimervoortArray = this.props.players.filter((player) => {
   return player.village[0].name === "Sluimervoort"
 })

 const wMayorArray = wakkerdamArray.filter((player) => {
   return player.mayor === true
 })

 const sMayorArray = sluimervoortArray.filter((player) => {
   return player.mayor === true
 })
----------------------------------
makeMayor = (player) => {
 const updatedPlayer = { mayor: !player.mayor }
 if (sMayorArray.length === 0 ){
   this.props.updateMayor(player._id, updatedPlayer)
   } else if (sMayorArray.length > 0) {
       return null
   }
 if (wMayorArray.length === 0 ){
   this.props.updateMayor(player._id, updatedPlayer)
   } else if (wMayorArray.length > 0) {
    return null
   }
 }
