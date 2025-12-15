import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatTime, formatDate } from '../../utils/formatters';
import { useDeviceStore } from '../../store/deviceStore';
import { useUIStore } from '../../store/uiStore';

/**
 * Schedule list showing next watering for Plants and Livestock
 */
export const ScheduleList = ({ schedules }) => {
  const { addToast } = useUIStore();
  const [confirmModal, setConfirmModal] = useState(null);

  const plantSchedule = schedules?.find(s => s.target === 'plants');
  const livestockSchedule = schedules?.find(s => s.target === 'livestock');

  const handleRunNow = (schedule) => {
    setConfirmModal({
      schedule,
      action: 'run',
    });
  };

  const handlePause = (schedule) => {
    setConfirmModal({
      schedule,
      action: 'pause',
    });
  };

  const confirmAction = () => {
    if (confirmModal.action === 'run') {
      addToast({
        variant: 'success',
        title: 'Schedule Running',
        message: `${confirmModal.schedule.name} started successfully`,
      });
    } else {
      addToast({
        variant: 'info',
        title: 'Schedule Paused',
        message: `${confirmModal.schedule.name} has been paused`,
      });
    }
    setConfirmModal(null);
  };

  const ScheduleTile = ({ schedule, label }) => {
    if (!schedule) {
      return (
        <Card>
          <div className="text-center text-biyokaab-gray py-4">
            No {label} schedule
          </div>
        </Card>
      );
    }

    const nextRun = new Date(schedule.next_run);

    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-biyokaab-navy">{label}</h3>
          <span className="text-sm text-biyokaab-gray">{schedule.name}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-biyokaab-gray">Next run</div>
            <div className="text-xl font-semibold text-biyokaab-navy">{formatTime(nextRun)}</div>
            <div className="text-sm text-biyokaab-gray">{formatDate(nextRun, 'MMM d')}</div>
          </div>

          <div>
            <div className="text-sm text-biyokaab-gray">Amount</div>
            <div className="text-lg font-semibold">{schedule.amount_l} L</div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRunNow(schedule)}
              className="flex-1"
            >
              Run Now
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePause(schedule)}
              className="flex-1"
            >
              Pause
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScheduleTile schedule={plantSchedule} label="Plants" />
        <ScheduleTile schedule={livestockSchedule} label="Livestock" />
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.action === 'run' ? 'Run Schedule Now?' : 'Pause Schedule?'}
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            {confirmModal?.action === 'run'
              ? `Are you sure you want to run "${confirmModal?.schedule?.name}" now?`
              : `Are you sure you want to pause "${confirmModal?.schedule?.name}"?`}
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmAction}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};


