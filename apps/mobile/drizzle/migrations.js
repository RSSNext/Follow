// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from "./0000_harsh_shiva.sql"
import m0001 from "./0001_bored_hobgoblin.sql"
import m0002 from "./0002_smart_power_man.sql"
import m0003 from "./0003_known_roland_deschain.sql"
import m0004 from "./0004_majestic_thunderbolt_ross.sql"
import m0005 from "./0005_tense_sleepwalker.sql"
import m0006 from "./0006_exotic_kid_colt.sql"
import m0007 from "./0007_curvy_tarantula.sql"
import journal from "./meta/_journal.json"

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
    m0007,
  },
}
