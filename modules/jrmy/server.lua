local MAX_JOBS = GetConvarInt('inventory:jrmyMaxJobs', 3)
local framework = GetConvar('inventory:framework', 'esx')

local getPlayer, getActiveJob, setActiveJob, jobExists, getPool, setPool, getJobLabel

if framework == 'esx' then
    local ESX
    local function esx()
        if not ESX then ESX = exports.es_extended:getSharedObject() end
        return ESX
    end

    getPlayer = function(src) return esx().GetPlayerFromId(src) end
    getActiveJob = function(p)
        local j = p.getJob()
        return { name = j.name, grade = j.grade }
    end
    setActiveJob = function(p, name, grade)
        p.setJob(name, grade or 0)
        return p.getJob().name == name
    end
    jobExists = function(name, grade) return esx().DoesJobExist(name, tostring(grade or 0)) end
    getPool = function(p) return p.getMeta and p.getMeta('jrmyJobPool') or nil end
    setPool = function(p, pool) if p.setMeta then p.setMeta('jrmyJobPool', pool) end end
    getJobLabel = function(name)
        local jobs = esx().GetJobs()
        return jobs[name] and jobs[name].label or name
    end
elseif framework == 'qbx' then
    getPlayer = function(src) return exports.qbx_core:GetPlayer(src) end
    getActiveJob = function(p)
        local j = p.PlayerData.job
        return { name = j.name, grade = j.grade and j.grade.level or 0 }
    end
    setActiveJob = function(p, name, grade)
        return exports.qbx_core:SetJob(p.PlayerData.source, name, grade or 0) == true
    end
    jobExists = function(name)
        local jobs = exports.qbx_core:GetJobs()
        return jobs[name] ~= nil
    end
    getPool = function(p) return p.PlayerData.metadata and p.PlayerData.metadata.jrmyJobPool or nil end
    setPool = function(p, pool) p.Functions.SetMetaData('jrmyJobPool', pool) end
    getJobLabel = function(name)
        local jobs = exports.qbx_core:GetJobs()
        return jobs[name] and jobs[name].label or name
    end
end

if not getPlayer then return end

local function readPool(player)
    local stored = getPool(player)
    local pool = {}

    if type(stored) == 'table' then
        for i = 1, #stored do
            local entry = stored[i]
            if type(entry) == 'table' and type(entry.name) == 'string' then
                pool[#pool + 1] = { name = entry.name, grade = tonumber(entry.grade) or 0 }
            end
        end
    end

    return pool
end

local function poolWithActive(player)
    local pool = readPool(player)
    local active = getActiveJob(player)

    if active.name and active.name ~= '' then
        local idx
        for i = 1, #pool do
            if pool[i].name == active.name then
                idx = i
                break
            end
        end

        if idx then
            if pool[idx].grade ~= active.grade then
                pool[idx].grade = active.grade
                setPool(player, pool)
            end
        else
            pool[#pool + 1] = { name = active.name, grade = active.grade or 0 }
            setPool(player, pool)
        end
    end

    return pool, active
end

lib.callback.register('ox_inventory:jrmyMultijobGet', function(source)
    local player = getPlayer(source)
    if not player then return { active = '', jobs = {}, max = MAX_JOBS } end

    local pool, active = poolWithActive(player)
    local jobs = {}
    for i = 1, #pool do
        jobs[i] = { name = pool[i].name, grade = pool[i].grade, label = getJobLabel(pool[i].name) }
    end

    return { active = active.name or '', jobs = jobs, max = MAX_JOBS }
end)

lib.callback.register('ox_inventory:jrmyMultijobSwitch', function(source, jobName)
    if type(jobName) ~= 'string' then return false end

    local player = getPlayer(source)
    if not player then return false end

    local pool = poolWithActive(player)
    for i = 1, #pool do
        if pool[i].name == jobName then
            if not jobExists(jobName, pool[i].grade) then return false end
            return setActiveJob(player, jobName, pool[i].grade)
        end
    end

    return false
end)

lib.callback.register('ox_inventory:jrmyMultijobLeave', function(source, jobName)
    if type(jobName) ~= 'string' then return false end

    local player = getPlayer(source)
    if not player then return false end

    if jobName == getActiveJob(player).name then return false end

    local pool = readPool(player)
    local kept = {}
    for i = 1, #pool do
        if pool[i].name ~= jobName then kept[#kept + 1] = pool[i] end
    end

    setPool(player, kept)
    return true
end)

exports('jrmyMultijobAdd', function(source, jobName, grade)
    if type(jobName) ~= 'string' then return false end
    grade = tonumber(grade) or 0

    local player = getPlayer(source)
    if not player then return false end
    if not jobExists(jobName, grade) then return false end

    local pool = readPool(player)
    for i = 1, #pool do
        if pool[i].name == jobName then
            pool[i].grade = grade
            setPool(player, pool)
            return true
        end
    end

    if #pool >= MAX_JOBS then return false end

    pool[#pool + 1] = { name = jobName, grade = grade }
    setPool(player, pool)
    return true
end)
