import { useState } from 'react';
import VisualTextEditor from '../VisualTextEditor';
import { renderFormattedText } from '../../../utils/textFormatter';
import ColorPaletteInput from '../ColorPaletteInput';
import { DEFAULT_PRICING_PLANS } from '../../../context/SettingsContext';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  Star,
  Clock,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function PricingTab({ current, onChange, onFocus, setFormData }) {
  const pricingPlans = Array.isArray(current.pricingPlans) && current.pricingPlans.length > 0
    ? current.pricingPlans
    : DEFAULT_PRICING_PLANS;

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'monthly' | 'daily'
  const [editingId, setEditingId] = useState(null); // plan id or 'new'
  const [planForm, setPlanForm] = useState({
    id: '',
    name: '',
    planType: 'monthly', // 'monthly' | 'daily'
    price: 1999,
    priceUnit: '/mo',
    description: '',
    featuresText: '',
    popular: false,
  });

  const handleStartAdd = () => {
    setPlanForm({
      id: `plan-${Date.now()}`,
      name: '',
      planType: 'monthly',
      price: 2499,
      priceUnit: '/mo',
      description: 'Professional workspace solution tailored for growing startups.',
      featuresText: 'High-Speed WiFi\nFree Coffee & Tea\nCommunity Access\nMeeting Room Credits',
      popular: false,
    });
    setEditingId('new');
  };

  const handleStartEdit = (plan) => {
    const isMonthly = plan.monthlyPrice !== null && plan.monthlyPrice !== undefined;
    const priceVal = isMonthly ? plan.monthlyPrice : plan.dailyPrice;
    const defaultUnit = isMonthly ? '/mo' : (plan.name === 'Conference Room' ? 'per hour' : '/day');

    setPlanForm({
      id: plan.id || `${plan.name}-${Date.now()}`,
      name: plan.name || '',
      planType: isMonthly ? 'monthly' : 'daily',
      price: priceVal || 999,
      priceUnit: plan.priceUnit || defaultUnit,
      description: plan.description || '',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      popular: !!plan.popular,
    });
    setEditingId(plan.id || plan.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSavePlan = (e) => {
    e?.preventDefault();
    if (!planForm.name.trim()) {
      alert('Please enter a plan name.');
      return;
    }

    const priceNum = Number(planForm.price) || 0;
    const isMonthly = planForm.planType === 'monthly';

    // Parse features from newline-delimited text
    const featuresList = planForm.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedPlanObject = {
      id: planForm.id,
      name: planForm.name.trim(),
      monthlyPrice: isMonthly ? priceNum : null,
      dailyPrice: !isMonthly ? priceNum : null,
      priceUnit: planForm.priceUnit || (isMonthly ? '/mo' : '/day'),
      description: planForm.description.trim(),
      features: featuresList.length > 0 ? featuresList : ['High-Speed WiFi', 'Free Coffee & Tea'],
      popular: planForm.popular,
    };

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...pricingPlans, updatedPlanObject];
    } else {
      updatedList = pricingPlans.map((p) =>
        (p.id === editingId || p.name === editingId) ? updatedPlanObject : p
      );
    }

    setFormData((prev) => ({
      ...prev,
      pricingPlans: updatedList,
    }));
    setEditingId(null);
  };

  const handleDeletePlan = (planId) => {
    if (pricingPlans.length <= 1) {
      alert('You must keep at least 1 pricing plan.');
      return;
    }
    const updatedList = pricingPlans.filter(
      (p) => p.id !== planId && p.name !== planId
    );
    setFormData((prev) => ({
      ...prev,
      pricingPlans: updatedList,
    }));
    if (editingId === planId) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= pricingPlans.length) return;
    const copy = [...pricingPlans];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      pricingPlans: copy,
    }));
  };

  const handleTogglePopular = (planId) => {
    const updatedList = pricingPlans.map((p) => {
      const currentId = p.id || p.name;
      if (currentId === planId) {
        return { ...p, popular: !p.popular };
      }
      return p;
    });
    setFormData((prev) => ({
      ...prev,
      pricingPlans: updatedList,
    }));
  };

  const handleRestoreDefaultPlans = () => {
    if (window.confirm('Restore the original 5 default pricing plans?')) {
      setFormData((prev) => ({
        ...prev,
        pricingPlans: DEFAULT_PRICING_PLANS,
      }));
      setEditingId(null);
    }
  };

  const filteredPlans = pricingPlans.filter((p) => {
    if (activeFilter === 'monthly') return p.monthlyPrice !== null && p.monthlyPrice !== undefined;
    if (activeFilter === 'daily') return p.dailyPrice !== null && p.dailyPrice !== undefined;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Copy Settings */}
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Pricing Section Copy</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Plans &amp; Memberships Header — format words with colors, gradients, and sizes visually
          </p>
        </div>
        <span className="text-xs text-neon-yellow font-semibold px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">
          Plans Header
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisualTextEditor
          label="Heading (Prefix)"
          name="pricingHeading"
          value={current.pricingHeading || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('pricingHeading')}
          placeholder="e.g. Simple, Transparent"
        />
        <VisualTextEditor
          label="Accent Word (Gradient Highlight)"
          name="pricingAccent"
          value={current.pricingAccent || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('pricingAccent')}
          placeholder="e.g. Pricing"
        />
      </div>

      {/* Pricing Card CTA Button (Book Now) */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Pricing Card CTA Button
          </h4>
          <span className="text-[10px] text-slate-400">Card action button across all plans</span>
        </div>

        <VisualTextEditor
          label="Card Button Label (e.g. Book Now)"
          name="pricingButtonText"
          value={current.pricingButtonText || ''}
          onChange={onChange}
          onFocus={() => onFocus?.('pricingButtonText')}
          placeholder="e.g. Book Now"
        />

        {/* Live Card Button Preview */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Button Preview:</span>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-md pointer-events-none"
          >
            {renderFormattedText(current.pricingButtonText || 'Book Now')}
          </button>
        </div>
      </div>

      {/* Individual Pricing Colors */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Pricing Section Colors (Optional Overrides)
          </h4>
          <span className="text-[10px] text-slate-500">Overrides global colors for Pricing</span>
        </div>

        <ColorPaletteInput
          label="Heading Color"
          name="pricingHeadingColor"
          value={current.pricingHeadingColor || ''}
          onChange={onChange}
          defaultValue="#ffffff"
          defaultLabel="Default (White)"
        />
      </div>

      {/* ============================================================ */}
      {/* DYNAMIC PRICING PLANS MANAGER */}
      {/* ============================================================ */}
      <div className="p-5 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Manage Pricing Plans &amp; Cards
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-semibold">
                {pricingPlans.length} Plans Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add new plans to fill the 3-column grid, edit rates, features, or mark most popular.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaultPlans}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset pricing plans back to original 5 defaults"
            >
              <RotateCcw size={13} />
              Reset Plans
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-blue hover:to-neon-purple text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(176,38,255,0.4)] transition-all cursor-pointer"
            >
              <Plus size={15} />
              Add New Plan
            </button>
          </div>
        </div>

        {/* FILTER BUTTONS (ALL / MONTHLY / DAILY) */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${activeFilter === 'all'
                ? 'bg-white/20 border-white text-white font-bold'
                : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
          >
            All ({pricingPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('monthly')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${activeFilter === 'monthly'
                ? 'bg-neon-purple/20 border-neon-purple text-white font-bold'
                : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
          >
            Monthly Only ({pricingPlans.filter((p) => p.monthlyPrice !== null).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('daily')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${activeFilter === 'daily'
                ? 'bg-neon-blue/20 border-neon-blue text-white font-bold'
                : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
          >
            Daily Only ({pricingPlans.filter((p) => p.dailyPrice !== null).length})
          </button>
        </div>

        {/* INLINE PLAN ADD / EDIT FORM */}
        {editingId && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-neon-purple/40 shadow-lg space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-neon-purple uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                {editingId === 'new' ? 'Add New Pricing Plan' : 'Edit Pricing Plan'}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <VisualTextEditor
                  label="Plan Name"
                  name="planName"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g. Virtual Office or Flexi Desk"
                  helperText="Highlight any word to apply neon colors, gradients, bold, or size."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Billing Period Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPlanForm({
                        ...planForm,
                        planType: 'monthly',
                        priceUnit: planForm.priceUnit === '/day' || planForm.priceUnit === 'per hour' ? '/mo' : planForm.priceUnit
                      })
                    }
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${planForm.planType === 'monthly'
                        ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_10px_rgba(176,38,255,0.3)]'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                  >
                    <Calendar size={13} />
                    Monthly Plan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPlanForm({
                        ...planForm,
                        planType: 'daily',
                        priceUnit: planForm.priceUnit === '/mo' ? '/day' : planForm.priceUnit
                      })
                    }
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${planForm.planType === 'daily'
                        ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                  >
                    <Clock size={13} />
                    Daily / Hourly
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Price (₹ INR)
                </label>
                <input
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                  placeholder="e.g. 1999"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-sm focus:border-neon-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Price Unit Suffix
                </label>
                <div className="flex gap-1.5">
                  {['/mo', '/month', '/day', 'per hour', '/hr'].map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setPlanForm({ ...planForm, priceUnit: unit })}
                      className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${planForm.priceUnit === unit
                          ? 'bg-white/20 border-white text-white font-bold'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <VisualTextEditor
              label="Short Description"
              name="planDescription"
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              placeholder="e.g. Ideal for remote workers and early-stage entrepreneurs."
              helperText="Highlight words to style them."
            />

            <VisualTextEditor
              label="Features List (Enter one feature per line)"
              name="featuresText"
              value={planForm.featuresText}
              onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
              placeholder="High-Speed WiFi&#10;Free Coffee & Tea&#10;Meeting Room Access&#10;Community Networking"
              multiline
              rows={4}
              helperText="Each new line becomes a bullet point with a checkmark on the card. Highlight words to apply colors, bold, or sizes!"
            />

            {/* Popular toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
              <input
                type="checkbox"
                id="plan-popular-toggle"
                checked={planForm.popular}
                onChange={(e) => setPlanForm({ ...planForm, popular: e.target.checked })}
                className="w-4 h-4 rounded accent-neon-pink cursor-pointer"
              />
              <label htmlFor="plan-popular-toggle" className="text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5">
                <Star size={14} className={planForm.popular ? 'text-neon-pink fill-neon-pink' : 'text-slate-400'} />
                Highlight as &quot;MOST POPULAR&quot; (displays prominent glowing banner)
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(176,38,255,0.5)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                Save Plan
              </button>
            </div>
          </div>
        )}

        {/* PLANS LIST */}
        <div className="space-y-2.5">
          {filteredPlans.map((plan, index) => {
            const planId = plan.id || plan.name || `plan-${index}`;
            const isMonthly = plan.monthlyPrice !== null && plan.monthlyPrice !== undefined;
            const priceVal = isMonthly ? plan.monthlyPrice : plan.dailyPrice;
            const unitVal = plan.priceUnit || (isMonthly ? '/mo' : (plan.name === 'Conference Room' ? 'per hour' : '/day'));

            return (
              <div
                key={planId}
                className={`p-3.5 rounded-xl bg-black/40 border transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${plan.popular ? 'border-neon-purple/50 bg-neon-purple/[0.04]' : 'border-white/10 hover:border-white/20'
                  }`}
              >
                <div
                  onClick={() => handleStartEdit(plan)}
                  className="flex items-start sm:items-center gap-3 min-w-0 cursor-pointer flex-1 group"
                  title="Click to edit this plan"
                >
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 text-center min-w-[50px] group-hover:scale-105 transition-transform">
                    <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400">
                      {isMonthly ? 'Month' : 'Daily'}
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      ₹{priceVal}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        #{index + 1}
                      </span>
                      <h5 className="text-sm font-bold text-white truncate group-hover:text-neon-purple transition-colors">
                        {renderFormattedText(plan.name)}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({unitVal})
                      </span>
                      {plan.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white text-[9px] font-bold shadow-sm">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      {renderFormattedText(plan.description)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>{(plan.features || []).length} features included</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Quick Popular Toggle Button (Tick Box) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePopular(planId);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${plan.popular
                        ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_12px_rgba(255,41,117,0.35)] ring-1 ring-neon-pink/50'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                      }`}
                    title={plan.popular ? 'Currently Most Popular. Click tick to toggle.' : 'Click to set this plan as Most Popular'}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${plan.popular ? 'border-neon-pink bg-neon-pink text-white' : 'border-white/30 bg-black/40'
                      }`}>
                      {plan.popular && <Check size={12} className="stroke-[3]" />}
                    </div>
                    <span>{plan.popular ? 'Most Popular' : 'Set Popular'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === pricingPlans.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(plan)}
                    className="p-1.5 rounded-lg border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 transition-colors cursor-pointer"
                    title="Edit plan"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(planId)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
