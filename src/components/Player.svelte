<script lang="ts">
  import type { Player } from "$lib/player";

  export let player: Player;
  export let host = false;
  export let current = false;
</script>

<div class={`player ${current ? "current" : ""}`}>
  <img
    class="portrait"
    src="/images/portrait.png"
    width="75"
    height="75"
    alt="portrait"
  />
  <span>{host ? "(Хост) " : ""}{player.name}</span>
  <span>Lives {player.lives}</span>
  <span>Needed characters {player.neededCharacters}</span>
  <span>Spectating {player.spectating}</span>
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }

  .portrait {
    border-radius: 50%;
    margin: 5px;
  }

  .current .portrait {
    border: 3px solid white;
  }
</style>
